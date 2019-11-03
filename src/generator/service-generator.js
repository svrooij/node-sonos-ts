const fetch = require('node-fetch')
const parse = require('fast-xml-parser').parse
const fs = require('fs')
const path = require('path')
const deviceUrl = `http://${process.env.SONOS_HOST || '192.168.96.56'}:1400`
const deviceDescriptionUrl = `${deviceUrl}/xml/device_description.xml`

const serviceDirectory = path.join(__dirname, '..', 'services')
const sonosBaseFile = path.join(__dirname, '..', 'snonos-device-base.ts')

fetch(deviceDescriptionUrl)
  .then(response => {
    if (response.ok) {
      return response.text()
    }
    throw new Error(`DeviceDescription Failed ${response.status} ${response.statusText}`)
  })
  .then(parse)
  .then(deviceDescription => {
    // console.log(JSON.stringify(deviceDescription, null, 2))
    const services = []
    // Device services
    deviceDescription.root.device.serviceList.service.forEach(s => services.push(s))
    // Device list services
    deviceDescription.root.device.deviceList.device.forEach(d => {
      d.serviceList.service.forEach(s => services.push(s))
    })
    return services
  })
  .then(services => {
    // console.log(services)
    services.forEach(s => {
      generateServiceFile(s)
    })

    generateIndexFile(services)
    generateSonosBaseFile(services)
  })
  .catch(console.log)

const generateServiceFile = function (service) {
  const name = getServiceName(service)
  console.log('Parsing %s service', name)
  fetch(`${deviceUrl}${service.SCPDURL}`)
    .then(response => {
      if (response.ok) {
        return response.text()
      }
      throw new Error(`DeviceDescription Failed ${response.status} ${response.statusText}`)
    })
    .then(parse)
    .then(serviceDescription => {
      // console.log(JSON.stringify(serviceDescription, null, 2))
      const variables = serviceDescription.scpd.serviceStateTable.stateVariable
      const actions = Array.isArray(serviceDescription.scpd.actionList.action) ? serviceDescription.scpd.actionList.action : [serviceDescription.scpd.actionList.action]
      // console.log(variables)
      // console.log(JSON.stringify(actions, null, 2))
      return generateServiceContent(service, name, variables, actions)
    })
    .then(generatedClass => {
      fs.writeFileSync(path.join(serviceDirectory, getFilenameForService(name) + '.ts'), generatedClass)
    })
}

const getServiceName = function (service) {
  return service.serviceId.substring(service.serviceId.lastIndexOf(':') + 1)
}

const generateServiceContent = function (service, name, variables, actions) {
  const extraImport = actions.find(a => a.name === 'Browse') !== undefined ? 'import { BrowseResponse } from \'../models\'\r\n' : ''
  return `// Auto-generated on ${(new Date()).toString('yyyy-MM-dd')}
import { BaseService } from './base-service';
${extraImport}
export class ${name}Service extends BaseService {
  readonly serviceNane: string = '${name}';
  readonly controlUrl: string = '${service.controlURL}';  
  readonly eventSubUrl: string = '${service.eventSubURL}';
  readonly scpUrl: string = '${service.SCPDURL}';
  

  // Actions
${generateActionsAndResponses(variables, actions)}`
}

const generateActionsAndResponses = function (variables, actions) {
  const actionsOutput = []
  const responsedOutput = []
  if (actions.name !== undefined) actions = new Array(actions)
  if (!Array.isArray(actions)) return '}\r\n'
  // Not sure if I want to sort the actions, any thoughts?
  actions.sort(dynamicCompare('name')).forEach(action => {
    let args = []
    if (action.argumentList && action.argumentList.argument) {
      args = action.argumentList.argument.name !== undefined ? new Array(action.argumentList.argument) : Object.values(action.argumentList.argument)
    }
    // console.log('Action %s %s %j', action.name, typeof args, args)
    const inArgs = args.filter(a => a.direction === 'in')
    const hasInput = inArgs.length > 0
    const outArgs = args.filter(a => a.direction === 'out')
    const hasOutput = outArgs.length > 0
    let line = `  ${action.name}(`
    if (hasInput) {
      line += 'input: { '
      line += inArgs.map(a => `${a.name}: ${getVariableType(variables, a.relatedStateVariable)}`).join(', ')
      line += ' }'
      if (inArgs.length === 1 && inArgs[0].name === 'InstanceID') line += ' = { InstanceID: 0 }'
    }
    line += '): '
    if (!hasOutput) {
      line += 'Promise<boolean> { '
    } else {
      line += `Promise<${action.name}Response> { `
      let responseLine = `export interface ${action.name}Response {\r\n  `
      responseLine += outArgs.map(a => `${a.name}: ${getVariableType(variables, a.relatedStateVariable)}`).join(',\r\n  ')
      responseLine += '\r\n}'
      if (action.name !== 'Browse') responsedOutput.push(responseLine)
    }
    if (hasInput) {
      line += 'return this.'
      line += hasOutput ? `SoapRequestWithBody<typeof input, ${action.name}Response>` : 'SoapRequestWithBodyNoResponse<typeof input>'
      line += `('${action.name}', input);`
    } else {
      line += 'return this.'
      line += hasOutput ? `SoapRequest<${action.name}Response>` : 'SoapRequestNoResponse'
      line += `('${action.name}');`
    }
    line += ' }'

    actionsOutput.push(line)
  })
  return actionsOutput.join('\r\n') + '\r\n}\r\n\r\n// Response classes\r\n' + responsedOutput.join('\r\n\r\n') + '\r\n'
}

const getVariableType = function (variables, name) {
  const variable = variables.find(v => v.name === name)
  if (variable === undefined) return 'Unknown?'
  if (variable.dataType === 'ui4' ||
    variable.dataType === 'i4' ||
    variable.dataType === 'ui2' ||
    variable.dataType === 'i2') return 'number'
  return variable.dataType
}

const getFilenameForService = function (name) {
  switch (name) {
    case 'AlarmClock':
      return 'alarm-clock.service'
    case 'AudioIn':
      return 'audio-in.service'
    case 'AVTransport':
      return 'av-transport.service'
    case 'ConnectionManager':
      return 'connection-manager.service'
    case 'ContentDirectory':
      return 'content-directory.service'
    case 'DeviceProperties':
      return 'device-properties.service'
    case 'GroupManagement':
      return 'group-management.service'
    case 'GroupRenderingControl':
      return 'group-rendering-control.service'
    case 'MusicServices':
      return 'music-services.service'
    case 'QPlay':
      return 'q-play.service'
    case 'Queue':
      return 'queue.service'
    case 'RenderingControl':
      return 'rendering-control.service'
    case 'SystemProperties':
      return 'system-properties.services'
    case 'VirtualLineIn':
      return 'virtual-line-in.service'
    case 'ZoneGroupTopology':
      return 'zone-group-topology.service'
    default:
      return `new-${name}.service`
  }
}

const generateIndexFile = function (services) {
  console.log('Generating index.ts file')
  let indexContent = `// Auto-generated on ${(new Date()).toString('yyyy-MM-dd')}\r\n`

  const serviceFileNames = services
    .map(s => getFilenameForService(getServiceName(s)))
    .filter((v, index, arr) => arr.indexOf(v) === index)
    .sort()

  // Add 'export * from 'file' for all services.
  serviceFileNames.forEach(filename => {
    indexContent += `export * from './${filename}'\r\n`
  })

  fs.writeFileSync(path.join(serviceDirectory, 'index.ts'), indexContent)
}

const generateSonosBaseFile = function (services) {
  console.log('Generating SonosDeviceBase')
  const serviceNames = services.map(s => getServiceName(s) + 'Service')
    .filter((v, index, arr) => arr.indexOf(v) === index)
    .sort()

  let output = `// Auto-generated on ${(new Date()).toString('yyyy-MM-dd')}\r\n`
  output += `import { ${serviceNames.join(', ')} } from './services'\r\n\r\n`
  output += 'export class SonosDeviceBase {\r\n'
  output += '  protected readonly host: string;\r\n'
  output += '  protected readonly port: number;\r\n'
  output += '  constructor(host: string, port: number = 1400) {\r\n'
  output += '    this.host = host;\r\n    this.port = port;\r\n  }\r\n\r\n'

  // Add all the services
  output += serviceNames.map(s => `  private ${s.toLowerCase()}: ${s} | undefined;\r\n` +
    `  public get ${s}(): ${s} {\r\n` +
    `    if (this.${s.toLowerCase()} === undefined) this.${s.toLowerCase()} = new ${s}(this.host, this.port);\r\n` +
    `    return this.${s.toLowerCase()};\r\n` +
    '  }')
    .join('\r\n\r\n')

  // Add class end
  output += '\r\n}\r\n'

  fs.writeFileSync(sonosBaseFile, output)
}

const dynamicCompare = function (property) {
  return function (a, b) {
    /* next line works with strings and numbers,
      * and you may want to customize it to your needs
      */
    return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0
  }
}
