const Discovery = require('../lib').SonosDeviceDiscovery

const discovery = new Discovery();

discovery
  .Search(15)
  // or
  // .SearchOne(15)
  .then((player) => {
    console.log('Found players', player);
  })
  .catch((err) => {
    console.error('Error with device discovery', err);
  });

