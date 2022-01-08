import { expect } from 'chai';
import { TestHelpers } from '../test-helpers';
import { ContentDirectoryService } from '../../src/services/content-directory.service.extension';

describe('ContentDirectoryService', () => {

  describe('BrowseParsedWithDefaults', () => {
    it('browse for Eminem works', async () => {
      const scope = TestHelpers.getScope(1401);
      const service = new ContentDirectoryService(TestHelpers.testHost, 1401);
      TestHelpers.mockRequestToService('/MediaServer/ContentDirectory/Control', 'ContentDirectory',
        'Browse', '<ObjectID>A:ARTIST/eminem</ObjectID><BrowseFlag>BrowseDirectChildren</BrowseFlag><Filter>*</Filter><StartingIndex>0</StartingIndex><RequestedCount>0</RequestedCount><SortCriteria></SortCriteria>',
        '<Result>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;container id=&quot;A:ARTIST/eminem/&quot; parentID=&quot;A:ARTIST/eminem&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;All&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.playlistContainer.sameArtist&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-playlist:*:*:*&quot;&gt;x-rincon-playlist:RINCON_000E58644CBC01400#A:ARTIST/eminem/&lt;/res&gt;&lt;/container&gt;&lt;container id=&quot;A:ARTIST/eminem/Encore&quot; parentID=&quot;A:ARTIST/eminem&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Encore&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.album.musicAlbum&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-playlist:*:*:*&quot;&gt;x-rincon-playlist:RINCON_000E58644CBC01400#A:ARTIST/eminem/Encore&lt;/res&gt;&lt;dc:creator&gt;Eminem&lt;/dc:creator&gt;&lt;upnp:albumArtURI&gt;/getaa?u=x-file-cifs%3a%2f%2fnas.local%2fmusic%2fEminem%2fEncore%2520%255b2004%255d%2f01%2520Eminem%2520-%2520Encore%2520%255b2004%255d-%2520Curtains%2520Up.mp3&amp;amp;v=1958&lt;/upnp:albumArtURI&gt;&lt;/container&gt;&lt;container id=&quot;A:ARTIST/eminem/The%20Marshall%20Mathers%20LP&quot; parentID=&quot;A:ARTIST/eminem&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;The Marshall Mathers LP&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.album.musicAlbum&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-playlist:*:*:*&quot;&gt;x-rincon-playlist:RINCON_000E58644CBC01400#A:ARTIST/eminem/The%20Marshall%20Mathers%20LP&lt;/res&gt;&lt;dc:creator&gt;Eminem&lt;/dc:creator&gt;&lt;upnp:albumArtURI&gt;/getaa?u=x-file-cifs%3a%2f%2fnas.local%2fmusic%2fEminem%2fThe%2520Marshall%2520Mathers%2520LP%2520%255b2000%255d%2f01%2520Eminem%2520-%2520The%2520Marshall%2520Mathers%2520LP%2520%255b2000%255d-%2520Public%2520Service%2520Announcement%25202000.mp3&amp;amp;v=1958&lt;/upnp:albumArtURI&gt;&lt;/container&gt;&lt;container id=&quot;A:ARTIST/eminem/The%20Marshall%20Mathers%20LP%202&quot; parentID=&quot;A:ARTIST/eminem&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;The Marshall Mathers LP 2&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.album.musicAlbum&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-playlist:*:*:*&quot;&gt;x-rincon-playlist:RINCON_000E58644CBC01400#A:ARTIST/eminem/The%20Marshall%20Mathers%20LP%202&lt;/res&gt;&lt;dc:creator&gt;Eminem&lt;/dc:creator&gt;&lt;upnp:albumArtURI&gt;/getaa?u=x-file-cifs%3a%2f%2fnas.local%2fmusic%2fEminem%2fThe%2520Marshall%2520Mathers%2520LP%25202%2520%255b2013%255d%2f01%2520Eminem%2520-%2520The%2520Marshall%2520Mathers%2520LP%25202%2520%255b2013%255d-%2520Bad%2520Guy.mp3&amp;amp;v=1958&lt;/upnp:albumArtURI&gt;&lt;/container&gt;&lt;/DIDL-Lite&gt;</Result><NumberReturned>4</NumberReturned><TotalMatches>4</TotalMatches><UpdateID>0</UpdateID>',
        scope);
      
      const result = await service.BrowseParsedWithDefaults('A:ARTIST/eminem');
      expect(result.NumberReturned).to.be.equal(4);
      expect(result.Result[1]).to.have.nested.property('Title', 'Encore');
      expect(result.Result[1]).to.have.nested.property('ProtocolInfo', 'x-rincon-playlist:*:*:*');
    });

    it('search for Eminem works', async () => {
      const service = new ContentDirectoryService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaServer/ContentDirectory/Control', 'ContentDirectory',
        'Browse', '<ObjectID>A:ARTIST:eminem</ObjectID><BrowseFlag>BrowseDirectChildren</BrowseFlag><Filter>*</Filter><StartingIndex>0</StartingIndex><RequestedCount>0</RequestedCount><SortCriteria></SortCriteria>',
        '<Result>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;container id=&quot;A:ARTIST/Eminem&quot; parentID=&quot;A:ARTIST&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Eminem&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.person.musicArtist&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-playlist:*:*:*&quot;&gt;x-rincon-playlist:RINCON_000E58644CBC01400#A:ARTIST/Eminem&lt;/res&gt;&lt;/container&gt;&lt;container id=&quot;A:ARTIST/Eminem%20feat.%2050%20Cent%20%26%20Nate%20Dogg&quot; parentID=&quot;A:ARTIST&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Eminem feat. 50 Cent &amp;amp; Nate Dogg&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.person.musicArtist&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-playlist:*:*:*&quot;&gt;x-rincon-playlist:RINCON_000E58644CBC01400#A:ARTIST/Eminem%20feat.%2050%20Cent%20%26%20Nate%20Dogg&lt;/res&gt;&lt;/container&gt;&lt;container id=&quot;A:ARTIST/Eminem%20feat.%20Bizarre&quot; parentID=&quot;A:ARTIST&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Eminem feat. Bizarre&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.person.musicArtist&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-playlist:*:*:*&quot;&gt;x-rincon-playlist:RINCON_000E58644CBC01400#A:ARTIST/Eminem%20feat.%20Bizarre&lt;/res&gt;&lt;/container&gt;&lt;container id=&quot;A:ARTIST/Eminem%20feat.%20D12&quot; parentID=&quot;A:ARTIST&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Eminem feat. D12&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.person.musicArtist&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-playlist:*:*:*&quot;&gt;x-rincon-playlist:RINCON_000E58644CBC01400#A:ARTIST/Eminem%20feat.%20D12&lt;/res&gt;&lt;/container&gt;&lt;container id=&quot;A:ARTIST/Eminem%20feat.%20Dido&quot; parentID=&quot;A:ARTIST&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Eminem feat. Dido&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.person.musicArtist&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-playlist:*:*:*&quot;&gt;x-rincon-playlist:RINCON_000E58644CBC01400#A:ARTIST/Eminem%20feat.%20Dido&lt;/res&gt;&lt;/container&gt;&lt;container id=&quot;A:ARTIST/Eminem%20feat.%20Dr.%20Dre%20%26%2050%20Cent&quot; parentID=&quot;A:ARTIST&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Eminem feat. Dr. Dre &amp;amp; 50 Cent&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.person.musicArtist&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-playlist:*:*:*&quot;&gt;x-rincon-playlist:RINCON_000E58644CBC01400#A:ARTIST/Eminem%20feat.%20Dr.%20Dre%20%26%2050%20Cent&lt;/res&gt;&lt;/container&gt;&lt;container id=&quot;A:ARTIST/Eminem%20feat.%20Dr.%20Dre,%20Snoop%20Dogg,%20Xzibit%20%26%20Nate%20Dogg&quot; parentID=&quot;A:ARTIST&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Eminem feat. Dr. Dre, Snoop Dogg, Xzibit &amp;amp; Nate Dogg&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.person.musicArtist&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-playlist:*:*:*&quot;&gt;x-rincon-playlist:RINCON_000E58644CBC01400#A:ARTIST/Eminem%20feat.%20Dr.%20Dre,%20Snoop%20Dogg,%20Xzibit%20%26%20Nate%20Dogg&lt;/res&gt;&lt;/container&gt;&lt;container id=&quot;A:ARTIST/Eminem%20feat.%20Jamie%20N%20Commons&quot; parentID=&quot;A:ARTIST&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Eminem feat. Jamie N Commons&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.person.musicArtist&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-playlist:*:*:*&quot;&gt;x-rincon-playlist:RINCON_000E58644CBC01400#A:ARTIST/Eminem%20feat.%20Jamie%20N%20Commons&lt;/res&gt;&lt;/container&gt;&lt;container id=&quot;A:ARTIST/Eminem%20feat.%20Kendrick%20Lamar&quot; parentID=&quot;A:ARTIST&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Eminem feat. Kendrick Lamar&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.person.musicArtist&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-playlist:*:*:*&quot;&gt;x-rincon-playlist:RINCON_000E58644CBC01400#A:ARTIST/Eminem%20feat.%20Kendrick%20Lamar&lt;/res&gt;&lt;/container&gt;&lt;container id=&quot;A:ARTIST/Eminem%20feat.%20Nate%20Ruess&quot; parentID=&quot;A:ARTIST&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Eminem feat. Nate Ruess&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.person.musicArtist&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-playlist:*:*:*&quot;&gt;x-rincon-playlist:RINCON_000E58644CBC01400#A:ARTIST/Eminem%20feat.%20Nate%20Ruess&lt;/res&gt;&lt;/container&gt;&lt;container id=&quot;A:ARTIST/Eminem%20feat.%20Obie%20Trice,%20Stat%20Quo%20%26%2050%20Cent&quot; parentID=&quot;A:ARTIST&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Eminem feat. Obie Trice, Stat Quo &amp;amp; 50 Cent&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.person.musicArtist&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-playlist:*:*:*&quot;&gt;x-rincon-playlist:RINCON_000E58644CBC01400#A:ARTIST/Eminem%20feat.%20Obie%20Trice,%20Stat%20Quo%20%26%2050%20Cent&lt;/res&gt;&lt;/container&gt;&lt;container id=&quot;A:ARTIST/Eminem%20feat.%20RBX%20%26%20Sticky%20Fingaz&quot; parentID=&quot;A:ARTIST&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Eminem feat. RBX &amp;amp; Sticky Fingaz&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.person.musicArtist&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-playlist:*:*:*&quot;&gt;x-rincon-playlist:RINCON_000E58644CBC01400#A:ARTIST/Eminem%20feat.%20RBX%20%26%20Sticky%20Fingaz&lt;/res&gt;&lt;/container&gt;&lt;container id=&quot;A:ARTIST/Eminem%20feat.%20Rihanna&quot; parentID=&quot;A:ARTIST&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Eminem feat. Rihanna&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.person.musicArtist&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-playlist:*:*:*&quot;&gt;x-rincon-playlist:RINCON_000E58644CBC01400#A:ARTIST/Eminem%20feat.%20Rihanna&lt;/res&gt;&lt;/container&gt;&lt;container id=&quot;A:ARTIST/Eminem%20feat.%20Sia&quot; parentID=&quot;A:ARTIST&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Eminem feat. Sia&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.person.musicArtist&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-playlist:*:*:*&quot;&gt;x-rincon-playlist:RINCON_000E58644CBC01400#A:ARTIST/Eminem%20feat.%20Sia&lt;/res&gt;&lt;/container&gt;&lt;container id=&quot;A:ARTIST/Eminem%20feat.%20Skylar%20Grey&quot; parentID=&quot;A:ARTIST&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Eminem feat. Skylar Grey&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.person.musicArtist&lt;/upnp:class&gt;&lt;res protocolInfo=&quot;x-rincon-playlist:*:*:*&quot;&gt;x-rincon-playlist:RINCON_000E58644CBC01400#A:ARTIST/Eminem%20feat.%20Skylar%20Grey&lt;/res&gt;&lt;/container&gt;&lt;/DIDL-Lite&gt;</Result><NumberReturned>15</NumberReturned><TotalMatches>15</TotalMatches><UpdateID>0</UpdateID>');
      
      const result = await service.BrowseParsedWithDefaults('A:ARTIST:eminem');
      expect(result.NumberReturned).to.be.equal(15);
      expect(result.Result[0]).to.have.nested.property('Title', 'Eminem');
    });
  });

  describe('GetAlbumArtistDisplayOption()', () => {
    it('works', async () => {
      const service = new ContentDirectoryService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaServer/ContentDirectory/Control', 'ContentDirectory',
        'GetAlbumArtistDisplayOption', undefined,
        '<AlbumArtistDisplayOption>WMP</AlbumArtistDisplayOption>');
      
      const result = await service.GetAlbumArtistDisplayOption();
      expect(result.AlbumArtistDisplayOption).to.be.equal('WMP');
    });
  });

  describe('GetBrowseable()', () => {
    it('works', async () => {
      const service = new ContentDirectoryService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaServer/ContentDirectory/Control', 'ContentDirectory',
        'GetBrowseable', undefined,
        '<IsBrowseable>1</IsBrowseable>');
      
      const result = await service.GetBrowseable();
      expect(result.IsBrowseable).to.be.true
    });
  });

  describe('GetLastIndexChange()', () => {
    it('works', async () => {
      const service = new ContentDirectoryService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaServer/ContentDirectory/Control', 'ContentDirectory',
        'GetLastIndexChange', undefined,
        '<LastIndexChange>F2022-01-07 05:00:00</LastIndexChange>');
      
      const result = await service.GetLastIndexChange();
      expect(result.LastIndexChange).to.be.equal('F2022-01-07 05:00:00');
    });
  });

  describe('GetSearchCapabilities()', () => {
    it('works', async () => {
      const service = new ContentDirectoryService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaServer/ContentDirectory/Control', 'ContentDirectory',
        'GetSearchCapabilities', undefined,
        '<SearchCaps></SearchCaps>');
      
      const result = await service.GetSearchCapabilities();
      expect(result).to.have.nested.property('SearchCaps');
    });
  });

  describe('GetShareIndexInProgress()', () => {
    it('works', async () => {
      const service = new ContentDirectoryService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaServer/ContentDirectory/Control', 'ContentDirectory',
        'GetShareIndexInProgress', undefined,
        '<IsIndexing>0</IsIndexing>');
      
      const result = await service.GetShareIndexInProgress();
      expect(result.IsIndexing).to.be.false;
    });
  });

  describe('GetSortCapabilities()', () => {
    it('works', async () => {
      const service = new ContentDirectoryService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaServer/ContentDirectory/Control', 'ContentDirectory',
        'GetSortCapabilities', undefined,
        '<SortCaps></SortCaps>');
      
      const result = await service.GetSortCapabilities();
      expect(result).to.have.nested.property('SortCaps');
    });
  });

  describe('GetSystemUpdateID()', () => {
    it('works', async () => {
      const service = new ContentDirectoryService(TestHelpers.testHost, 1400);
      TestHelpers.mockRequestToService('/MediaServer/ContentDirectory/Control', 'ContentDirectory',
        'GetSystemUpdateID', undefined,
        '<Id>40</Id>');
      
      const result = await service.GetSystemUpdateID();
      expect(result.Id).to.be.equal(40);
    });
  });



  // describe('Event parsing', () => {
  //   it('works', (done) => {
  //     process.env.SONOS_DISABLE_EVENTS = 'true'
  //     const service = new ContentDirectoryService(TestHelpers.testHost, 1400);
  //     service.Events.once('serviceEvent', (data) => {
  //       expect(data.Browseable).to.be.equal(true);

  //       done()
  //     })
  //     service.ParseEvent('<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><AudioInputName>Audio Component</AudioInputName></e:property><e:property><Icon>AudioComponent</Icon></e:property><e:property><LineInConnected>1</LineInConnected></e:property><e:property><LeftLineInLevel>1</LeftLineInLevel></e:property><e:property><RightLineInLevel>1</RightLineInLevel></e:property></e:propertyset>');
  //     delete process.env.SONOS_DISABLE_EVENTS
  //   }, 10)
  // })
});
