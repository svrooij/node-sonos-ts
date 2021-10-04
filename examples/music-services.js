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

sonos.MusicServicesService.ListAndParseAvailableServices(true)
  .then(async services => {
    console.log('Available music services\r\n  ID  Name                       Auth')
    services.forEach(s => {
      console.log('%s  %s\t%s', s.Id.toString().padStart(3, ' '), s.Name.padEnd(20, ' '), s.Policy.Auth.padEnd(9, ' '))
    })
    const serviceAnswer = await askQuestion('Which service do you want to connect?\r\nName or ID: ');
    const service = services.find(s => s.Id == serviceAnswer || s.Name === serviceAnswer);
    if (service === undefined) {
      console.log('Service with %s not found', serviceAnswer);
    }
    console.log('Opening music service client, you can exit by pressing ctrl + C, or by submitting exit')
    console.log('Service details:\r\n', JSON.stringify(service));
    const client = await sonos.MusicServicesClient(service.Id);
    let keepRunning = true;
    do {
      const id = await askQuestion('Fetch Metadata for (\'root\' to get main list)\r\nId: ');
      // Do search
      // const term = await askQuestion('Term: ');
      // const results = await client.Search({ id: id, term: term, index: 0, count: 10 });

      // Browse Metadata
      const results = await client.GetMetadata({ id: id, index: 0, count: 10 });

      // Get item metadata
      // const results = await client.GetExtendedMetadata({ id: id });

      console.log('GetMetadata results:\r\n%s', JSON.stringify(results, null, 2));
    } while(keepRunning)
  })


// sonos.MusicServicesClient('Spotify')
//   .then(async client => {
//     const result = await client.Search({ id: 'artist', term: 'Guus', index: 0, count: 10});
//     console.log(JSON.stringify(result, null, 2))
//   }).catch(err => {
//     console.warn(err);
//   });


// sonos.MusicServicesClient('NRK Radio')
//   .then(musicClient => {
//     return musicClient.Search({ id: 'A:STATION', term: 'P1', index: 0, count: 10 })
//   })
//   .then(searchResult => {
//     console.log(JSON.stringify(searchResult, null, 2))
//     return sonos.SetAVTransportURI(searchResult.mediaMetadata[0].trackUri).then(success => sonos.Play())
//   })
//   .catch(console.error)

// sonos.MusicServicesClient('radioPup')
//   .then(musicClient => {
//     return musicClient.Search({ id: 'A:STATION', term: 'KISS FM To', index: 0, count: 10 })
//   })
//   .then(searchResult => {
//     console.log(JSON.stringify(searchResult, null, 2))
//     return sonos.SetAVTransportURI(searchResult.mediaMetadata[0].trackUri).then(success => sonos.Play())
//   })
//   .catch(console.error)

// const client = new SmapiClient({ name: 'radioPup', url: 'https://sonos.townsquaremedia.com/index.php', deviceId: '00-0E-58-64-4C-BC:A' })
// client.Search({ id: 'A:STATION', term: 'Tod', index: 0, count: 5 }).then(resp => {
//   console.log(JSON.stringify(resp, null, 2))
// }).catch(console.error)

// client.GetMediaUri({ id: 'station_TSM_CHRISTMAS' }).then(resp => {
//   console.log(JSON.stringify(resp, null, 2))
// }).catch(console.error)

// client.GetMediaMetadata({ id: 'station_TSM_CHRISTMAS' }).then(resp => {
//   console.log(JSON.stringify(resp, null, 2))
// }).catch(console.error)

// soap.createClientAsync('http://developer-assets.ws.sonos.com/files/Sonoswsdl-1.19.4-20190411.142401-3.wsdl', undefined, 'http://psapi.nrk.no/sonos/sonos.svc').then(music => {
//   console.log('Got client')
//   music.searchAsync({ search: 'bla', count: 10, index: 0 }).then(resp => {
//     console.log(resp)
//   }).catch(console.error)
// })
