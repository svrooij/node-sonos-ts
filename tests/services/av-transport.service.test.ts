import { expect }  from 'chai'

import { TestHelpers } from '../test-helpers'
import { AVTransportService } from '../../src/services/av-transport.service'

describe('AVTransportService', () => {
  describe('AddURIToQueue', () => {
    it('parses response', async () => {
      const track = 'http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3';
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"',
        '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>http://livingears.com/music/SceneNotHeard/091909/Do%20You%20Mind%20Kyla.mp3</EnqueuedURI><EnqueueAsNext>1</EnqueueAsNext><EnqueuedURIMetaData></EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued></u:AddURIToQueue>',
        'AddURIToQueueResponse',
        'AVTransport',
        '<FirstTrackNumberEnqueued>1</FirstTrackNumberEnqueued><NewQueueLength>1</NewQueueLength><NumTracksAdded>1</NumTracksAdded>'
      );

      var service = new AVTransportService(TestHelpers.testHost, 1400)

      var result = await service.AddURIToQueue({
        InstanceID: 0,
        EnqueuedURI: track,
        EnqueueAsNext: true,
        EnqueuedURIMetaData: '',
        DesiredFirstTrackNumberEnqueued: 0
      });
      expect(result).to.have.nested.property('FirstTrackNumberEnqueued', 1)
      expect(result).to.have.nested.property('NewQueueLength', 1)
      expect(result).to.have.nested.property('NumTracksAdded', 1)

    })
  })

  describe('Play()', () => {
    it('works', async () => {
      TestHelpers.mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Play"',
        '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>',
        'PlayResponse',
        'AVTransport'
      )
      var service = new AVTransportService(TestHelpers.testHost, 1400)

      var result = await service.Play({ InstanceID: 0, Speed: "1"});
      expect(result).to.be.eq(true);
    })
  })
})

