const fetch = require('node-fetch')
const parse = require('fast-xml-parser').parse
const fs = require('fs')
const path = require('path')
const deviceUrl = `http://${process.env.SONOS_HOST || '192.168.96.56'}:1400`
const deviceDescriptionUrl = `${deviceUrl}/xml/device_description.xml`

const serviceDirectory = path.join(__dirname, '..', 'services')

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
  })
  .catch(console.log)

const generateServiceFile = function (service) {
  const name = service.serviceId.substring(service.serviceId.lastIndexOf(':') + 1)
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
      const actions = serviceDescription.scpd.actionList.action
      // console.log(variables)
      // console.log(JSON.stringify(actions, null, 2))
      return generateServiceContent(service, name, variables, actions)
    })
    .then(generatedClass => {
      fs.writeFileSync(path.join(serviceDirectory, getFilenameForService(name)), generatedClass)
    })
}

const generateServiceContent = function (service, name, variables, actions) {
  return `// Auto-generated on ${(new Date()).toString('yyyy-MM-dd')}
import { BaseService } from './base-service';

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
  actions.forEach(action => {
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
    }
    line += '): '
    if (!hasOutput) {
      line += 'Promise<boolean> { '
    } else {
      line += `Promise<${action.name}Response> { `
      let responseLine = `interface ${action.name}Response {\r\n  `
      responseLine += outArgs.map(a => `${a.name}: ${getVariableType(variables, a.relatedStateVariable)}`).join(',\r\n  ')
      responseLine += '\r\n}'
      responsedOutput.push(responseLine)
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
  if (variable.dataType === 'ui4' || variable.dataType === 'i4' || variable.dataType === 'ui2') return 'number'
  return variable.dataType
}

const getFilenameForService = function (name) {
  switch (name) {
    case 'AlarmClock':
      return 'alarm-clock.service.ts'
    case 'AudioIn':
      return 'audio-in.service.ts'
    case 'AVTransport':
      return 'av-transport.service.ts'
    case 'ConnectionManager':
      return 'connection-manager.service.ts'
    case 'ContentDirectory':
      return 'content-directory.service.ts'
    case 'DeviceProperties':
      return 'device-properties.service.ts'
    case 'GroupManagement':
      return 'group-management.service.ts'
    case 'GroupRenderingControl':
      return 'group-rendering-control.service.ts'
    case 'MusicServices':
      return 'music-services.service.ts'
    case 'QPlay':
      return 'q-play.service.ts'
    case 'Queue':
      return 'queue.service.ts'
    case 'RenderingControl':
      return 'rendering-control.service.ts'
    case 'SystemProperties':
      return 'system-properties.services.ts'
    case 'VirtualLineIn':
      return 'virtual-line-in.service.ts'
    case 'ZoneGroupTopology':
      return 'zone-group-topology.service.ts'
    default:
      return `new-${name}.service.ts`
  }
}
