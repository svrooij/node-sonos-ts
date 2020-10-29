const fetch = require('node-fetch')
const parse = require('fast-xml-parser').parse
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const Handlebars = require('handlebars')

const deviceUrl = `http://${process.env.SONOS_HOST || '192.168.96.56'}:1400`
const deviceDescriptionUrl = `${deviceUrl}/xml/device_description.xml`

const documentationFile = path.join(__dirname, 'documentation.json')
const documentation = require(documentationFile)
const discoveryJsonFile = path.join(__dirname, 'discovered-services.json')

const fetchAndParse = async function (url) {
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.text()
      }
      throw new Error(`Loading ${url} failed ${response.status} ${response.statusText}`)
    })
    .then(parse)
}

const forceArray = function (input) {
  return Array.isArray(input) ? input : [input]
}

const dynamicCompare = function (property) {
  return function (a, b) {
    return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0
  }
}

const fixDocumentation = function () {
  const keys = Object.keys(documentation).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  const sortedDocs = {}
  keys.forEach(k => {
    sortedDocs[k] = documentation[k]
  })
  fs.writeFileSync(documentationFile, JSON.stringify(sortedDocs, null, 2))
}

const deviceDescriptionToServices = function (description) {
  const services = []
  // Device services
  description.serviceList.service.forEach(s => services.push(s))
  // Device list services
  description.deviceList.device.forEach(d => {
    d.serviceList.service.forEach(s => services.push(s))
  })
  return services
}

const getDeviceDescription = async function (url) {
  return fetchAndParse(url)
    .then(resp => resp.root.device)
}

const serviceIdToName = function (serviceId) {
  return serviceId.substring(serviceId.lastIndexOf(':') + 1)
}

const loadService = async function (service) {
  const serviceUrl = `${deviceUrl}${service.SCPDURL}`
  service.name = serviceIdToName(service.serviceId)
  console.log('Loading %s service', service.name)
  service.svcName = serviceIdToName(service.serviceId) + 'Service'
  return fetchAndParse(serviceUrl)
    .then(data => {
      service.data = {
        name: serviceIdToName(service.serviceId),
        variables: data.scpd.serviceStateTable.stateVariable,
        actions: Array.isArray(data.scpd.actionList.action)
          ? data.scpd.actionList.action.sort(dynamicCompare('name')) : [data.scpd.actionList.action]
      }
      service.docs = documentation[service.svcName]
      if (service.docs === undefined) {
        console.log('No docs for %s, add the following to ./documentation.json', service.data.name)
        console.log(',\r\n"%s" : {\r\n"Description":"",\r\n"File":""\r\n}', service.data.name)
      }
      service.parsed = {
        imports: [],
        methods: [],
        responses: []
      }
      return service
    })
}

/**
 * Adds extra imports to the service.
 * @param {*} service A loaded service
 */
const addImportsToService = function (service) {
  const extraImports = []
  if (service.data.actions.findIndex(a => a.name === 'Browse') !== -1) extraImports.push('BrowseResponse')
  if (service.data.variables.findIndex(v => v.name === 'CurrentPlayMode') !== -1) extraImports.push('PlayMode')
  if (service.data.variables.findIndex(v => v.name.indexOf('MetaData') > -1) !== -1) extraImports.push('Track')
  if (service.name === 'RenderingControl') extraImports.push('ChannelValue')
  if (extraImports.length > 0) service.parsed.imports = extraImports

  return service
}

/**
 * take related variable and guess correct typescript type
 * @param {*} service A loaded service
 * @param {string} name The name of the related variable
 */
const getRelatedVariable = function (service, name) {
  const vari = forceArray(service.data.variables).find(v => v.name === name)
  if (vari === undefined) return name

  if (name === 'CurrentPlayMode') {
    vari.ttype = 'PlayMode'
  } else if (name.indexOf('MetaData') > -1) {
    vari.ttype = 'string | Track'
  } else {
    switch (vari.dataType) {
      case 'ui4':
      case 'i4':
      case 'ui2':
      case 'i2':
        vari.ttype = 'number'
        break
      default:
        vari.ttype = vari.dataType
    }
  }
  return vari
}

const addMethodsToService = function (service) {
  service.data.actions.forEach(action => {
    const args = action.argumentList && action.argumentList.argument ? forceArray(action.argumentList.argument) : []
    const outArgs = args.filter(a => a.direction === 'out')
    const hasOutput = outArgs.length > 0
    const inArgs = args.filter(a => a.direction === 'in')
    let docs = (service.docs.Methods && service.docs.Methods[action.name])
      ? service.docs.Methods[action.name]
      : {}

    const actionObject = {
      name: action.name,
      responseType: hasOutput ? `${action.name}Response` : undefined,
      parameters: inArgs.map(a => {
        delete a.direction
        if (a.relatedStateVariable) {
          a.relatedStateVariable = getRelatedVariable(service, a.relatedStateVariable)
        }
        if (docs.Params && docs.Params[a.name]) {
          a.description = docs.Params[a.name]
        } else if (a.name === 'InstanceID') {
          a.description = 'Sonos only serves one Instance always set to 0';
        }
        return a
      }),

      defaultInput: inArgs.length === 1 && inArgs[0].name === 'InstanceID' ? ' = { InstanceID: 0 }' : undefined
    }

    if (outArgs.length > 0) {
      actionObject.outParameters = outArgs.map(a => {
        let par = {
          name: a.name
        };
        if (a.relatedStateVariable) {
          par.relatedStateVariable = getRelatedVariable(service, a.relatedStateVariable)
        }
        if (docs.Params && docs.Params[a.name]) {
          par.description = docs.Params[a.name]
        }
        return par
      })
    }

    if (docs.Description) {
      actionObject.description = docs.Description
    }

    if (docs.Remarks) {
      actionObject.remarks = docs.Remarks
    }

    service.parsed.methods.push(actionObject)
  })
  delete service.docs.Methods
  return service
}

const addEventPropertiesToService = function (service) {
  if (service.data.variables) {
    service.parsed.eventProperties = forceArray(service.data.variables)
      .filter(v => !v.name.startsWith('A_ARG_TYPE'))
      .sort(dynamicCompare('name'))
    service.parsed.eventProperties = service.parsed.eventProperties
      .map(v => {
        const variable = getRelatedVariable(service, v.name)
        if (variable.ttype === 'string | Track') variable.ttype = 'Track'
        const docsOverride = service.docs && service.docs.EventProperties ? service.docs.EventProperties[v.name] : undefined
        return {
          name: variable.name,
          ttype: docsOverride && docsOverride.Typescript ? docsOverride.Typescript : variable.ttype,
          isChannelValue: docsOverride && docsOverride.IsChannelValue === true
        }
      })
  }

  if (service.docs.EventProperties) delete service.docs.EventProperties
  return service
}

const addResponsesToService = function (service) {
  // console.debug('Adding responses for %s', service.data.name)
  const actions = service.data.actions.filter(action => action.argumentList && forceArray(action.argumentList.argument).findIndex(ar => ar.direction === 'out') > -1)
  actions.forEach(action => {
    service.parsed.responses.push({
      name: `${action.name}Response`,
      properties: forceArray(action.argumentList.argument)
        .filter(ar => ar.direction === 'out')
        .map(ar => {
          delete ar.direction
          if (ar.relatedStateVariable) {
            ar.relatedStateVariable = getRelatedVariable(service, ar.relatedStateVariable)
          }
          return ar
        })
    })
  })
  delete service.data
  return service
}

const getTemplate = function (template) {
  return Handlebars.compile(fs.readFileSync(path.join(__dirname, 'templates', `${template}.template.hbs`)).toString())
}

const generateServiceFile = function (service) {
  if (service.docs && service.docs.File) {
    service.parsed.responses = service.parsed.responses.filter(resp => resp.name !== 'BrowseResponse')
    const template = getTemplate('service')
    const extensionFile = path.join(__dirname, 'extensions', service.docs.File)
    if (fs.existsSync(extensionFile)) {
      service.extension = fs.readFileSync(extensionFile)
    }
    let generatedService = template(service)
      .replace(/-{-/g, '{').replace(/-}-/g, '}')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    fs.writeFileSync(path.join(__dirname, '..', 'services', service.docs.File), generatedService)

    console.log('Service %s generated', service.name)
  }
}

const generateIndexFile = function (allServices) {
  const files = allServices
    .filter(s => s.docs !== undefined && s.docs.File !== undefined)
    .map(s => s.docs.File.slice(0, s.docs.File.indexOf('.ts')))
    .filter((v, index, arr) => arr.indexOf(v) === index)
    .sort()

  const template = getTemplate('index')
  const generatedIndex = template({ services: files })
  fs.writeFileSync(path.join(__dirname, '..', 'services', 'index.ts'), generatedIndex)
  console.log('Generated services/index.ts')
}

const generateBaseFile = function (allServices) {
  const services = allServices.map(s => {
    return {
      pName: s.svcName.toLowerCase(),
      name: s.svcName,
      documentation: s.docs.Description
    }
  })
    .filter((v, index, arr) => arr.findIndex(s => s.name === v.name) === index)
    .sort(dynamicCompare('name'))

  const template = getTemplate('sonos-base')
  const generatedBase = template({ services: services }).replace(/-{-/g, '{').replace(/-}-/g, '}')
  fs.writeFileSync(path.join(__dirname, '..', 'sonos-device-base.ts'), generatedBase)
  console.log('Generated sonos-device-base.ts')
}

const generateDocumentation = function (allServices) {
  const services = allServices
    .filter((v, index, arr) => arr.findIndex(s => s.name === v.name) === index)

  const template = getTemplate('docs')
  services.forEach(service => {
    const generatedDocs = template(service)
    fs.writeFileSync(path.join(__dirname, '..', '..', 'docs', 'sonos-device', 'services', service.svcName.toLowerCase() + '.md'), generatedDocs)
  })
  console.log('Service documentation updated')
}

const run = async function () {
  const args = process.argv.slice(2)

  if (args.indexOf('--sort-docs') > -1) fixDocumentation()

  const description = await getDeviceDescription(deviceDescriptionUrl);
  console.log('Loading services from %s gen %d', description.modelName, description.swGen);

  const serviceList = await deviceDescriptionToServices(description)
  let allServices = []
  for (let i = 0; i < serviceList.length; i++) {
    let service = await loadService(serviceList[i])
    service = addImportsToService(service)
    service = addMethodsToService(service)
    service = addEventPropertiesToService(service)
    service = addResponsesToService(service)
    allServices.push(service)
  }
  allServices = allServices.sort(dynamicCompare('svcName'))
  if (args.indexOf('--save-description') > -1) {
    fs.writeFileSync(discoveryJsonFile, JSON.stringify(allServices, null, 2))
    // Service file per model.
    const deviceDescription = {
      modelNumber: description.modelNumber,
      modelName: description.modelName,
      swGen: description.swGen,
      softwareVersion: description.softwareVersion,
      services: allServices
    }

    fs.writeFileSync(
      path.join(__dirname, `discovered-services.gen${description.swGen}_${description.modelNumber}.json`),
      JSON.stringify(deviceDescription, null, 2)
    )
  }

  if (args.includes('--load-files')) {
    const files = glob.sync('discovered-services.*_*.json', { cwd: __dirname });
    files.forEach(file => {
      const content = JSON.parse(fs.readFileSync(path.join(__dirname, file)))
      console.log('Adding cached services from %s', content.modelName);
      content.services.forEach(service => {
        const index = allServices.findIndex(s => s.svcName === service.svcName);
        if(index === -1) {
          allServices.push(service);
        } else {
          allServices[index] = service;
        }
        
      })
    });
    allServices = allServices.sort(dynamicCompare('svcName'))
    console.log(files);

    if (args.indexOf('--save-description') > -1) {
      fs.writeFileSync(discoveryJsonFile, JSON.stringify(allServices, null, 2))
    }
  }

  if (args.indexOf('--generate') > -1) {
    generateIndexFile(allServices)
    generateBaseFile(allServices)
    for (let i = 0; i < allServices.length; i++) {
      const service = allServices[i]
      generateServiceFile(service)
    }
  }
  if (args.indexOf('--docs') > -1) {
    generateDocumentation(allServices)
  }
}

run()
  .then(() => {
    console.log('Generator finished')
  })
  .catch(console.error)
