const readline = require('readline');
const SonosDevice = require('../lib').SonosDevice

const sonos = new SonosDevice(process.env.SONOS_HOST || '192.168.96.56')

// Question code from https://stackoverflow.com/a/50890409/639153
function askQuestion(query) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }))
}

// Pick one of the services by name
sonos.MusicServicesService.ListAndParseAvailableServices(true).then(async services => {
  console.log('Available music services with supported authentication')
  console.log(' ID  Name                       Auth                 Mask                    Capabilities')
  const filteredServices = services.filter(s => s.Policy.Auth === 'AppLink' || s.Policy.Auth === 'DeviceLink');
  filteredServices.forEach(s => {

    const cap = parseInt(s.Capabilities)
    console.log('%s  %s\t%s\t%s\t%s', s.Id.toString().padStart(3, ' '), s.Name.padEnd(20, ' '), s.Policy.Auth.padEnd(9, ' '), s.Capabilities.toString().padStart(9, ' '), cap.toString(2).padStart(25, ' '))
  })
  const answer = await askQuestion('Which service do you want to login to?\r\nName or ID: ');
  const service = filteredServices.find(s => s.Id == answer || s.Name === answer);
  if(service) {
    const client = await sonos.MusicServicesClient(service.Id);
    let deviceLink;
    if (service.Policy.Auth === 'AppLink') {
      const appLink = await client.GetAppLink();
      deviceLink = appLink.authorizeAccount.deviceLink;
    } else if (service.Policy.Auth === 'DeviceLink') {
      deviceLink = await client.GetDeviceLinkCode();
    }

    console.log('Open the following link in a webbrowser: %s', deviceLink.regUrl)
    if(deviceLink.showLinkCode) {
      console.log('And enter this linkcode: %s', deviceLink.linkCode)
    }
    
    await askQuestion('Did you login and see a page that you can close the page and continue in the sonos app?\r\nPress enter to continue or CTRL+C to cancel');
    const deviceAuthCode = await client.GetDeviceAuthToken(deviceLink.linkCode);
    console.log('Authentication data for %s\r\n%s', service.Name, JSON.stringify(deviceAuthCode, null, 2));

    console.log('The credentials are also saved, so you can now get this client by calling\r\nsonos.MusicServicesClient(%d)', service.Id);
  }
}).catch(console.error)
