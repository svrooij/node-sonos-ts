const Discovery = require('../lib').SonosDeviceDiscovery

const discovery = new Discovery();

discovery
  .SearchOne(60)
  .then((player) => {
    console.log('Found player', player);
  })
  .catch((err) => {
    console.error('Error with device discovery', err);
  });
