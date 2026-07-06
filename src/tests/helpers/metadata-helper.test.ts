import MetadataHelper from '../../helpers/metadata-helper';

const { GenerateMetadata } = require('./legacy-helpers');

const spotifyTrack = 'spotify:track:6sYJuVcEu4gFHmeTLdHzRz';
const completeTrackUri = 'x-sonos-spotify:spotify:track:6sYJuVcEu4gFHmeTLdHzRz?sid=9&amp;flags=8224&amp;sn=7';

describe('MetadataHelper', () => {
  describe('GuessMetaDataAndTrackUri', () => {
    it('returns correct TrackUri', () => {
      const data = MetadataHelper.GuessMetaDataAndTrackUri(spotifyTrack);
      expect(data).toBeDefined();
      expect(data.metadata).toBeDefined();
      expect(data).toHaveProperty('trackUri', completeTrackUri);
    });
  });

  describe('GuessTrack', () => {
    it('Guess metadata for file:///jffs/settings/savedqueues.rsq#7', () => {
      const track = MetadataHelper.GuessTrack('file:///jffs/settings/savedqueues.rsq#7');
      expect(track).toHaveProperty('ItemId', 'SQ:7');
      expect(track).toHaveProperty('TrackUri', 'file:///jffs/settings/savedqueues.rsq#7');
    });

    it('Guess metadata for sonos:playlist:7', () => {
      const track = MetadataHelper.GuessTrack('sonos:playlist:7');
      expect(track).toHaveProperty('ItemId', 'SQ:7');
      expect(track).toHaveProperty('TrackUri', 'file:///jffs/settings/savedqueues.rsq#7');
    });

    it('Not guess metadata for sonos:playlist:a', () => {
      const track = MetadataHelper.GuessTrack('sonos:playlist:a');
      expect(track).toBeUndefined();;
    });
  });

  describe('GuessTrack -> NAS file (x-file-cifs)', () => {
    it('Guess metadata for x-file-cifs URI with spaces', () => {
      const uri = 'x-file-cifs://server/music/My%20Song.mp3';
      const track = MetadataHelper.GuessTrack(uri);
      expect(track).toBeDefined();
      expect(track).toHaveProperty('TrackUri', uri);
      expect(track).toHaveProperty('UpnpClass', 'object.item.audioItem.musicTrack');
      expect(track).toHaveProperty('ParentId', 'A:TRACKS');
      expect(track).toHaveProperty('CdUdn', 'RINCON_AssociatedZPUDN');
    });

    it('Extracts title from x-file-cifs URI', () => {
      const uri = 'x-file-cifs://server/music/MySong.mp3';
      const track = MetadataHelper.GuessTrack(uri);
      expect(track).toBeDefined();
      expect(track).toHaveProperty('Title', 'MySong');
    });
  });

  describe('GuessTrack -> Local library playlist (x-rincon-playlist)', () => {
    it('Guess metadata for x-rincon-playlist from A:TRACKS', () => {
      const uri = 'x-rincon-playlist:RINCON_XXX#A:TRACKS/MySong';
      const track = MetadataHelper.GuessTrack(uri);
      expect(track).toBeDefined();
      expect(track).toHaveProperty('UpnpClass', 'object.item.audioItem.musicTrack');
      expect(track).toHaveProperty('ParentId', 'A:TRACKS');
      expect(track).toHaveProperty('CdUdn', 'RINCON_AssociatedZPUDN');
    });

    it('Guess metadata for x-rincon-playlist from A:ALBUMS', () => {
      const uri = 'x-rincon-playlist:RINCON_XXX#A:ALBUMS/MyAlbum';
      const track = MetadataHelper.GuessTrack(uri);
      expect(track).toBeDefined();
      expect(track).toHaveProperty('UpnpClass', 'object.item.audioItem.musicAlbum');
      expect(track).toHaveProperty('ParentId', 'A:ALBUMS');
    });

    it('Guess metadata for x-rincon-playlist from A:ALBUMARTIST', () => {
      const uri = 'x-rincon-playlist:RINCON_XXX#A:ALBUMARTIST/MyArtist';
      const track = MetadataHelper.GuessTrack(uri);
      expect(track).toBeDefined();
      expect(track).toHaveProperty('UpnpClass', 'object.item.audioItem.musicArtist');
      expect(track).toHaveProperty('ParentId', 'A:ALBUMARTIST');
    });

    it('Guess metadata for x-rincon-playlist from A:GENRE', () => {
      const uri = 'x-rincon-playlist:RINCON_XXX#A:GENRE/MyGenre';
      const track = MetadataHelper.GuessTrack(uri);
      expect(track).toBeDefined();
      expect(track).toHaveProperty('UpnpClass', 'object.container.genre.musicGenre');
      expect(track).toHaveProperty('ParentId', 'A:GENRE');
    });

    it('Guess metadata for x-rincon-playlist from A:COMPOSER', () => {
      const uri = 'x-rincon-playlist:RINCON_XXX#A:COMPOSER/MyComposer';
      const track = MetadataHelper.GuessTrack(uri);
      expect(track).toBeDefined();
      expect(track).toHaveProperty('UpnpClass', 'object.container.person.composer');
      expect(track).toHaveProperty('ParentId', 'A:COMPOSER');
    });

    it('Throws when x-rincon-playlist URI has no parentID', () => {
      const uri = 'x-rincon-playlist:RINCON_XXX_no_hash';
      expect(() => MetadataHelper.GuessTrack(uri)).toThrow('ParentID not found');
    });
  });

  describe('GuessTrack -> Internet radio (x-sonosapi-stream)', () => {
    it('Guess metadata for x-sonosapi-stream URI', () => {
      const uri = 'x-sonosapi-stream:s24896?sid=254&flags=8224&sn=0';
      const track = MetadataHelper.GuessTrack(uri);
      expect(track).toBeDefined();
      expect(track).toHaveProperty('UpnpClass', 'object.item.audioItem.audioBroadcast');
      expect(track).toHaveProperty('Title', 'Some radio station');
      expect(track).toHaveProperty('ItemId', '10092020s24896');
    });

    it('Guess metadata for x-sonosapi-stream URI with tunein station id', () => {
      const uri = 'x-sonosapi-stream:tunein%3a9464?sid=303&flags=8232&sn=2';
      const track = MetadataHelper.GuessTrack(uri);
      expect(track).toBeDefined();
      expect(track).toHaveProperty('UpnpClass', 'object.item.audioItem.audioBroadcast');
      expect(track).toHaveProperty('Title', 'Some radio station');
      expect(track).toHaveProperty('ItemId', '10092020tunein%3a9464');
    });
  });

  describe('GuessTrack -> MP3 radio (x-rincon-mp3radio)', () => {
    it('Guess metadata for x-rincon-mp3radio URI', () => {
      const uri = 'x-rincon-mp3radio://http://stream.example.com/live.mp3';
      const track = MetadataHelper.GuessTrack(uri);
      expect(track).toBeDefined();
      expect(track).toHaveProperty('TrackUri', uri);
      expect(track).toHaveProperty('ItemId', '-1');
    });
  });

  describe('GuessTrack -> Amazon Prime (x-rincon-cpcontainer catalog)', () => {
    it('Guess metadata for Amazon Prime container', () => {
      const uri = 'x-rincon-cpcontainer:1006206ccatalog%2falbums%2fB07J43XNVP%2f%23albumTracks';
      const track = MetadataHelper.GuessTrack(uri);
      expect(track).toBeDefined();
      expect(track).toHaveProperty('TrackUri', uri);
      expect(track).toHaveProperty('ItemId', '1006206ccatalog%2falbums%2fB07J43XNVP%2f%23albumTracks');
      expect(track).toHaveProperty('UpnpClass', 'object.container.playlistContainer');
    });
  });

  describe('GuessTrack -> SoundCloud (x-rincon-cpcontainer)', () => {
    it('Guess metadata for SoundCloud likes', () => {
      const uri = 'x-rincon-cpcontainer:100d206cuser-fav:soundcloud:user:123456789';
      const track = MetadataHelper.GuessTrack(uri);
      expect(track).toBeDefined();
      expect(track).toHaveProperty('TrackUri', uri);
      expect(track).toHaveProperty('ItemId', '100d206cuser-fav:soundcloud:user:123456789');
      expect(track).toHaveProperty('UpnpClass', 'object.container.albumList');
      expect(track).toHaveProperty('CdUdn', 'SA_RINCON40967_X_#Svc40967-0-Token');
    });
  });

  describe('GuessTrack -> radio shorthand (radio:s)', () => {
    it('Guess metadata for radio shorthand URI', () => {
      const uri = 'radio:s24896';
      const track = MetadataHelper.GuessTrack(uri);
      expect(track).toBeDefined();
      expect(track).toHaveProperty('UpnpClass', 'object.item.audioItem.audioBroadcast');
      expect(track).toHaveProperty('Title', 'Some radio station');
      expect(track).toHaveProperty('TrackUri', 'x-sonosapi-stream:s24896?sid=254&flags=8224&sn=0');
      expect(track).toHaveProperty('ItemId', '10092020s24896');
    });
  });

  describe('GuessTrack -> Apple Music', () => {
    it('Guess metadata for apple:album:1025210938', () => {
      const track = MetadataHelper.GuessTrack('apple:album:1025210938');
      expect(track).toHaveProperty('TrackUri', 'x-rincon-cpcontainer:1004206calbum:1025210938?sid=204');
      expect(track).toHaveProperty('UpnpClass', 'object.item.audioItem.musicAlbum');
    });

    it('Guess metadata for x-rincon-cpcontainer:1004206calbum:1025210938', () => {
      const track = MetadataHelper.GuessTrack('x-rincon-cpcontainer:1004206calbum:1025210938');
      expect(track).toHaveProperty('TrackUri', 'x-rincon-cpcontainer:1004206calbum:1025210938?sid=204');
      expect(track).toHaveProperty('UpnpClass', 'object.item.audioItem.musicAlbum');
    });

    it('Guess metadata for apple:libraryalbum:l.OIdA15a', () => {
      const track = MetadataHelper.GuessTrack('apple:libraryalbum:l.OIdA15a');
      expect(track).toHaveProperty('TrackUri', 'x-rincon-cpcontainer:1004206clibraryalbum:l.OIdA15a?sid=204');
      expect(track).toHaveProperty('UpnpClass', 'object.item.audioItem.musicAlbum');
    });

    it('Guess metadata for x-rincon-cpcontainer:1004206clibraryalbum:l.OIdA15a', () => {
      const track = MetadataHelper.GuessTrack('x-rincon-cpcontainer:1004206clibraryalbum:l.OIdA15a');
      expect(track).toHaveProperty('TrackUri', 'x-rincon-cpcontainer:1004206clibraryalbum:l.OIdA15a?sid=204');
      expect(track).toHaveProperty('UpnpClass', 'object.item.audioItem.musicAlbum');
    });

    it('Guess metadata for apple:playlist:pl.cf589c8b40dc40cd9ddc2e61493d5efd', () => {
      const track = MetadataHelper.GuessTrack('apple:playlist:pl.cf589c8b40dc40cd9ddc2e61493d5efd');
      expect(track).toHaveProperty('TrackUri', 'x-rincon-cpcontainer:1006206cplaylist:pl.cf589c8b40dc40cd9ddc2e61493d5efd?sid=204');
      expect(track).toHaveProperty('UpnpClass', 'object.container.playlistContainer');
    });

    it('Guess metadata for x-rincon-cpcontainer:1006206cplaylist:pl.cf589c8b40dc40cd9ddc2e61493d5efd?sid=204', () => {
      const track = MetadataHelper.GuessTrack('x-rincon-cpcontainer:1006206cplaylist:pl.cf589c8b40dc40cd9ddc2e61493d5efd?sid=204');
      expect(track).toHaveProperty('TrackUri', 'x-rincon-cpcontainer:1006206cplaylist:pl.cf589c8b40dc40cd9ddc2e61493d5efd?sid=204');
      expect(track).toHaveProperty('UpnpClass', 'object.container.playlistContainer');
    });

    it('Guess metadata for apple:libraryplaylist:p.rQ5rCxE48W', () => {
      const track = MetadataHelper.GuessTrack('apple:libraryplaylist:p.rQ5rCxE48W');
      expect(track).toHaveProperty('TrackUri', 'x-rincon-cpcontainer:1006206clibraryplaylist:p.rQ5rCxE48W?sid=204');
      expect(track).toHaveProperty('UpnpClass', 'object.container.playlistContainer');
    });

    it('Guess metadata for x-rincon-cpcontainer:1006206clibraryplaylist:p.rQ5rCxE48W?sid=204', () => {
      const track = MetadataHelper.GuessTrack('x-rincon-cpcontainer:1006206clibraryplaylist:p.rQ5rCxE48W?sid=204');
      expect(track).toHaveProperty('TrackUri', 'x-rincon-cpcontainer:1006206clibraryplaylist:p.rQ5rCxE48W?sid=204');
      expect(track).toHaveProperty('UpnpClass', 'object.container.playlistContainer');
    });

    it('Guess metadata for apple:track:1025212410', () => {
      const track = MetadataHelper.GuessTrack('apple:track:1025212410');
      expect(track).toHaveProperty('TrackUri', 'x-sonos-http:song:1025212410.mp4?sid=204');
      expect(track).toHaveProperty('UpnpClass', 'object.item.audioItem.musicTrack');
    });

    it('Guess metadata for x-sonos-http:song:1025212410.mp4?sid=204', () => {
      const track = MetadataHelper.GuessTrack('x-sonos-http:song:1025212410.mp4?sid=204');
      expect(track).toHaveProperty('TrackUri', 'x-sonos-http:song:1025212410.mp4?sid=204');
      expect(track).toHaveProperty('UpnpClass', 'object.item.audioItem.musicTrack');
    });

    it('Guess metadata for apple:librarytrack:i.m3g9uLvzB7', () => {
      const track = MetadataHelper.GuessTrack('apple:librarytrack:i.m3g9uLvzB7');
      expect(track).toHaveProperty('TrackUri', 'x-sonos-http:librarytrack:i.m3g9uLvzB7.mp4?sid=204');
      expect(track).toHaveProperty('UpnpClass', 'object.item.audioItem.musicTrack');
    });

    it('Guess metadata for x-sonos-http:librarytrack:i.m3g9uLvzB7.mp4?sid=204', () => {
      const track = MetadataHelper.GuessTrack('x-sonos-http:librarytrack:i.m3g9uLvzB7.mp4?sid=204');
      expect(track).toHaveProperty('TrackUri', 'x-sonos-http:librarytrack:i.m3g9uLvzB7.mp4?sid=204');
      expect(track).toHaveProperty('UpnpClass', 'object.item.audioItem.musicTrack');
    });

    it('returns undefined for apple:unknown-type:1121931512', () => {
      const track = MetadataHelper.GuessTrack('apple:unknown-type:1121931512');
      expect(track).toBeUndefined();;
    });
  });

  describe('GuessTrack -> Deezer', () => {
    it('Guess metadata for deezer:album:169734362', () => {
      const track = MetadataHelper.GuessTrack('deezer:album:169734362');
      expect(track).toHaveProperty('TrackUri', 'x-rincon-cpcontainer:1004006calbum-169734362?sid=2&flags=108&sn=23');
    });

    it('Guess metadata for x-rincon-cpcontainer:1004006calbum-169734362?sid=2&amp;flags=108&amp;sn=23', () => {
      const track = MetadataHelper.GuessTrack('x-rincon-cpcontainer:1004006calbum-169734362?sid=2&amp;flags=108&amp;sn=23');
      expect(track).toHaveProperty('TrackUri', 'x-rincon-cpcontainer:1004006calbum-169734362?sid=2&flags=108&sn=23');
      expect(track).toHaveProperty('UpnpClass', 'object.container.album.musicAlbum.#HERO');
    });

    it('Guess metadata for deezer:artistTopTracks:6049784', () => {
      const track = MetadataHelper.GuessTrack('deezer:artistTopTracks:6049784');
      expect(track).toHaveProperty('TrackUri', 'x-rincon-cpcontainer:10fe206ctracks-artist-6049784?sid=2&flags=8300&sn=23');
    });

    it('Guess metadata for x-rincon-cpcontainer:10fe206ctracks-artist-6049784?sid=2&amp;flags=8300&amp;sn=23', () => {
      const track = MetadataHelper.GuessTrack('x-rincon-cpcontainer:10fe206ctracks-artist-6049784?sid=2&amp;flags=8300&amp;sn=23');
      expect(track).toHaveProperty('TrackUri', 'x-rincon-cpcontainer:10fe206ctracks-artist-6049784?sid=2&flags=8300&sn=23');
      expect(track).toHaveProperty('UpnpClass', 'object.container.#DEFAULT');
    });

    it('Guess metadata for deezer:playlist:1371651955', () => {
      const track = MetadataHelper.GuessTrack('deezer:playlist:1371651955');
      expect(track).toHaveProperty('TrackUri', 'x-rincon-cpcontainer:1006006cplaylist_spotify%3aplaylist-1371651955?sid=2&flags=108&sn=23');
    });

    it('Guess metadata for x-rincon-cpcontainer:1006006cplaylist_spotify%3aplaylist-1371651955?sid=2&amp;flags=108&amp;sn=23', () => {
      const track = MetadataHelper.GuessTrack('x-rincon-cpcontainer:1006006cplaylist_spotify%3aplaylist-1371651955?sid=2&amp;flags=108&amp;sn=23');
      expect(track).toHaveProperty('TrackUri', 'x-rincon-cpcontainer:1006006cplaylist_spotify%3aplaylist-1371651955?sid=2&flags=108&sn=23');
    });

    it('Guess metadata for deezer:track:1121931512', () => {
      const track = MetadataHelper.GuessTrack('deezer:track:1121931512');
      expect(track).toHaveProperty('TrackUri', 'x-sonos-http:tr:1121931512.mp3?sid=2&flags=8224&sn=23');
    });

    it('Guess metadata for x-sonos-http:tr%3a1121931512.mp3?sid=2&amp;flags=8224&amp;sn=23', () => {
      const track = MetadataHelper.GuessTrack('x-sonos-http:tr%3a1121931512.mp3?sid=2&amp;flags=8224&amp;sn=23');
      expect(track).toHaveProperty('TrackUri', 'x-sonos-http:tr:1121931512.mp3?sid=2&flags=8224&sn=23');
      expect(track).toHaveProperty('UpnpClass', 'object.item.audioItem.musicTrack.#DEFAULT');
    });

    it('returns undefined for deezer:unknown-type:1121931512', () => {
      const track = MetadataHelper.GuessTrack('deezer:unknown-type:1121931512');
      expect(track).toBeUndefined();;
    });
  });

  describe('GuessTrack -> Spotify', () => {
    it('Guess metadata for Spotify artist top tracks', () => {
      const track = MetadataHelper.GuessTrack('spotify:artistTopTracks:72qVrKXRp9GeFQOesj0Pmv');
      expect(track).toBeDefined();
    });

    it('Guess metadata for Spotify track', () => {
      const track = MetadataHelper.GuessTrack(spotifyTrack);
      expect(track).toBeDefined();
    });

    it('Guess metadata for Spotify user playlist', () => {
      const uri = 'spotify:user:37i9dQZF1DX4WYpdgoIcn6'
      const track = MetadataHelper.GuessTrack(uri);
      expect(track).toBeDefined();
    });

    it('Guess metadata for Spotify user (Summer rewind)', () => {
      const uri = 'spotify:user:spotify:playlist:37i9dQZF1DWSBi5svWQ9Nk'
      const expectedTrackUri = 'x-rincon-cpcontainer:10062a6cspotify%3auser%3aspotify%3aplaylist%3a37i9dQZF1DWSBi5svWQ9Nk?sid=9&flags=10860&sn=7';
      const track = MetadataHelper.GuessTrack(uri);
      expect(track).toBeDefined();
      expect(track).toHaveProperty('TrackUri', expectedTrackUri);
    });

    it('Produces same metadata as legacy for Spotify track', () => {
      const track = MetadataHelper.GuessTrack(spotifyTrack);
      expect(track).toBeDefined();
      const legacyMetadataObject = GenerateMetadata(spotifyTrack, '', '2311');

      const metadata = MetadataHelper.TrackToMetaData(track);
      expect(metadata).toEqual(legacyMetadataObject.metadata);
    });

    it('Returns undefined for unsupported uri', () => {
      const uri = 'fake:music:service'
      const track = MetadataHelper.GuessTrack(uri);
      expect(track).toBeUndefined();;
    });

    it('Returns undefined for unsupported spotify uri', () => {
      const uri = 'spotify:fake:fake-id'
      const track = MetadataHelper.GuessTrack(uri);
      expect(track).toBeUndefined();;
    });
  });

  describe('GuessTrackAndMetadata', () => {
    it('Works for Spotify album', () => {
      const data = MetadataHelper.GuessMetaDataAndTrackUri('spotify:album:5nD7RkUvn3TRlDcQSABOjo');
      expect(data).toBeDefined();
      expect(data).toHaveProperty('trackUri', 'x-rincon-cpcontainer:1004206cspotify:album:5nD7RkUvn3TRlDcQSABOjo?sid=9&flags=8300&sn=7');
      expect(data).toHaveProperty('metadata.ItemId', '0004206cspotify%3aalbum%3a5nD7RkUvn3TRlDcQSABOjo');
    });

    it('Works for Spotify artist radio', () => {
      const data = MetadataHelper.GuessMetaDataAndTrackUri('spotify:artistRadio:72qVrKXRp9GeFQOesj0Pmv');
      expect(data).toBeDefined();
      expect(data).toHaveProperty('trackUri', 'x-sonosapi-radio:spotify:artistRadio:72qVrKXRp9GeFQOesj0Pmv?sid=9&flags=8300&sn=7');
      expect(data).toHaveProperty('metadata.ItemId', '100c206cspotify%3aartistRadio%3a72qVrKXRp9GeFQOesj0Pmv');
    });

    it('Works for Spotify artist top tracks', () => {
      const data = MetadataHelper.GuessMetaDataAndTrackUri('spotify:artistTopTracks:72qVrKXRp9GeFQOesj0Pmv');
      expect(data).toBeDefined();
      expect(data).toHaveProperty('trackUri', 'x-rincon-cpcontainer:100e206cspotify:artistTopTracks:72qVrKXRp9GeFQOesj0Pmv?sid=9&flags=8300&sn=7');
      expect(data).toHaveProperty('metadata.ItemId', '100e206cspotify%3aartistTopTracks%3a72qVrKXRp9GeFQOesj0Pmv');
      expect(data).toHaveProperty('metadata.ParentId', '10052064spotify%3aartist%3a72qVrKXRp9GeFQOesj0Pmv');
    });

    it('Works for Spotify playlist', () => {
      const data = MetadataHelper.GuessMetaDataAndTrackUri('spotify:playlist:37i9dQZEVXbLoATJ81JYX');
      expect(data).toBeDefined();
      expect(data).toHaveProperty('trackUri', 'x-rincon-cpcontainer:1006206cspotify:playlist:37i9dQZEVXbLoATJ81JYX?sid=9&flags=8300&sn=7');
      expect(data).toHaveProperty('metadata.ItemId', '1006206cspotify%3aplaylist%3a37i9dQZEVXbLoATJ81JYX');
    });
  })

  describe('GetSimpleUri', () => {
    describe('Spotify', () => {
      it('reverses spotify track URI', () => {
        expect(MetadataHelper.GetSimpleUri(completeTrackUri)).toEqual(spotifyTrack);
      });

      it('reverses encoded spotify track URI', () => {
        expect(MetadataHelper.GetSimpleUri('x-sonos-spotify:spotify%3atrack%3a6sYJuVcEu4gFHmeTLdHzRz?sid=9&amp;flags=8224&amp;sn=7')).toEqual(spotifyTrack);
      });

      it('reverses spotify album URI', () => {
        expect(MetadataHelper.GetSimpleUri('x-rincon-cpcontainer:1004206cspotify:album:5nD7RkUvn3TRlDcQSABOjo?sid=9&flags=8300&sn=7')).toEqual('spotify:album:5nD7RkUvn3TRlDcQSABOjo');
      });

      it('reverses spotify playlist URI', () => {
        expect(MetadataHelper.GetSimpleUri('x-rincon-cpcontainer:1006206cspotify:playlist:37i9dQZEVXbLoATJ81JYX?sid=9&flags=8300&sn=7')).toEqual('spotify:playlist:37i9dQZEVXbLoATJ81JYX');
      });

      it('reverses spotify artist top tracks URI', () => {
        expect(MetadataHelper.GetSimpleUri('x-rincon-cpcontainer:100e206cspotify:artistTopTracks:72qVrKXRp9GeFQOesj0Pmv?sid=9&flags=8300&sn=7')).toEqual('spotify:artistTopTracks:72qVrKXRp9GeFQOesj0Pmv');
      });

      it('reverses spotify user playlist URI', () => {
        expect(MetadataHelper.GetSimpleUri('x-rincon-cpcontainer:10062a6cspotify:user:spotify:playlist:37i9dQZF1DWSBi5svWQ9Nk?sid=9&flags=10860&sn=7')).toEqual('spotify:user:spotify:playlist:37i9dQZF1DWSBi5svWQ9Nk');
      });

      it('reverses spotify artist radio URI', () => {
        expect(MetadataHelper.GetSimpleUri('x-sonosapi-radio:spotify:artistRadio:72qVrKXRp9GeFQOesj0Pmv?sid=9&flags=8300&sn=7')).toEqual('spotify:artistRadio:72qVrKXRp9GeFQOesj0Pmv');
      });

      it('round-trips spotify track', () => {
        const simple = 'spotify:track:6sYJuVcEu4gFHmeTLdHzRz';
        const data = MetadataHelper.GuessMetaDataAndTrackUri(simple);
        expect(MetadataHelper.GetSimpleUri(data.trackUri)).toEqual(simple);
      });
    });

    describe('Deezer', () => {
      it('reverses deezer track URI', () => {
        expect(MetadataHelper.GetSimpleUri('x-sonos-http:tr:1121931512.mp3?sid=2&flags=8224&sn=23')).toEqual('deezer:track:1121931512');
      });

      it('reverses encoded deezer track URI', () => {
        expect(MetadataHelper.GetSimpleUri('x-sonos-http:tr%3a1121931512.mp3?sid=2&amp;flags=8224&amp;sn=23')).toEqual('deezer:track:1121931512');
      });

      it('reverses deezer album URI', () => {
        expect(MetadataHelper.GetSimpleUri('x-rincon-cpcontainer:1004006calbum-169734362?sid=2&flags=108&sn=23')).toEqual('deezer:album:169734362');
      });

      it('reverses deezer artist top tracks URI', () => {
        expect(MetadataHelper.GetSimpleUri('x-rincon-cpcontainer:10fe206ctracks-artist-6049784?sid=2&flags=8300&sn=23')).toEqual('deezer:artistTopTracks:6049784');
      });

      it('reverses deezer playlist URI', () => {
        expect(MetadataHelper.GetSimpleUri('x-rincon-cpcontainer:1006006cplaylist_spotify%3aplaylist-1371651955?sid=2&flags=108&sn=23')).toEqual('deezer:playlist:1371651955');
      });

      it('round-trips deezer track', () => {
        const simple = 'deezer:track:1121931512';
        const data = MetadataHelper.GuessMetaDataAndTrackUri(simple);
        expect(MetadataHelper.GetSimpleUri(data.trackUri)).toEqual(simple);
      });
    });

    describe('Apple Music', () => {
      it('reverses apple track URI', () => {
        expect(MetadataHelper.GetSimpleUri('x-sonos-http:song:1025212410.mp4?sid=204')).toEqual('apple:track:1025212410');
      });

      it('reverses apple librarytrack URI', () => {
        expect(MetadataHelper.GetSimpleUri('x-sonos-http:librarytrack:i.m3g9uLvzB7.mp4?sid=204')).toEqual('apple:librarytrack:i.m3g9uLvzB7');
      });

      it('reverses apple album URI', () => {
        expect(MetadataHelper.GetSimpleUri('x-rincon-cpcontainer:1004206calbum:1025210938?sid=204')).toEqual('apple:album:1025210938');
      });

      it('reverses apple libraryalbum URI', () => {
        expect(MetadataHelper.GetSimpleUri('x-rincon-cpcontainer:1004206clibraryalbum:l.OIdA15a?sid=204')).toEqual('apple:libraryalbum:l.OIdA15a');
      });

      it('reverses apple playlist URI', () => {
        expect(MetadataHelper.GetSimpleUri('x-rincon-cpcontainer:1006206cplaylist:pl.cf589c8b40dc40cd9ddc2e61493d5efd?sid=204')).toEqual('apple:playlist:pl.cf589c8b40dc40cd9ddc2e61493d5efd');
      });

      it('reverses apple libraryplaylist URI', () => {
        expect(MetadataHelper.GetSimpleUri('x-rincon-cpcontainer:1006206clibraryplaylist:p.rQ5rCxE48W?sid=204')).toEqual('apple:libraryplaylist:p.rQ5rCxE48W');
      });

      it('round-trips apple track', () => {
        const simple = 'apple:track:1025212410';
        const data = MetadataHelper.GuessMetaDataAndTrackUri(simple);
        expect(MetadataHelper.GetSimpleUri(data.trackUri)).toEqual(simple);
      });
    });

    describe('Radio', () => {
      it('reverses internet radio URI', () => {
        expect(MetadataHelper.GetSimpleUri('x-sonosapi-stream:s24896?sid=254&flags=8224&sn=0')).toEqual('radio:s24896');
      });

      it('round-trips radio URI', () => {
        const simple = 'radio:s24896';
        const data = MetadataHelper.GuessMetaDataAndTrackUri(simple);
        expect(MetadataHelper.GetSimpleUri(data.trackUri)).toEqual(simple);
      });
    });

    describe('Sonos playlist', () => {
      it('reverses sonos playlist URI', () => {
        expect(MetadataHelper.GetSimpleUri('file:///jffs/settings/savedqueues.rsq#7')).toEqual('sonos:playlist:7');
      });

      it('round-trips sonos playlist URI', () => {
        const simple = 'sonos:playlist:7';
        const data = MetadataHelper.GuessMetaDataAndTrackUri(simple);
        expect(MetadataHelper.GetSimpleUri(data.trackUri)).toEqual(simple);
      });
    });

    it('returns undefined for unsupported URI', () => {
      expect(MetadataHelper.GetSimpleUri('x-rincon-mp3radio://http://stream.example.com/live.mp3')).toBeUndefined();
    });
  });

  describe('ParseDIDLTrack', () => {
    it('returns undefined for undefined input', () => {
      const result = MetadataHelper.ParseDIDLTrack(undefined, 'fake_host');
      expect(result).toBeUndefined();
    });

    it('parses res property for duration, TrackUri and ProtocolInfo', (done) => {
      const trackUri = 'http://example.com/track.mp3';
      const duration = '0:03:45';
      const protocolInfo = 'http-get:*:audio/mpeg:*';
      const didl = {
        'dc:title': 'Test Track',
        res: {
          '#text': trackUri,
          duration: duration,
          protocolInfo: protocolInfo,
        },
      };
      const result = MetadataHelper.ParseDIDLTrack(didl, 'fake_host');
      expect(result).toBeDefined();
      expect(result).toHaveProperty('TrackUri', trackUri);
      expect(result).toHaveProperty('Duration', duration);
      expect(result).toHaveProperty('ProtocolInfo', protocolInfo);
      done();
    });

    it('parses DIDL-Lite format with nested item', (done) => {
      const title = 'Nested Track';
      const artist = 'Some Artist';
      const didl = {
        'DIDL-Lite': {
          item: {
            'dc:title': title,
            'dc:creator': artist,
          },
        },
      };
      const result = MetadataHelper.ParseDIDLTrack(didl, 'fake_host');
      expect(result).toBeDefined();
      expect(result).toHaveProperty('Title', title);
      expect(result).toHaveProperty('Artist', artist);
      done();
    });

    it('resolves absolute albumArtURI without prepending host', (done) => {
      const absoluteArtUri = 'http://external.example.com/art.jpg';
      const didl = {
        'upnp:albumArtURI': absoluteArtUri,
        'dc:title': 'Track',
      };
      const result = MetadataHelper.ParseDIDLTrack(didl, 'fake_host');
      expect(result).toBeDefined();
      expect(result).toHaveProperty('AlbumArtUri', absoluteArtUri);
      done();
    });

    it('decodes html entities', (done) => {
      const album = 'Christmas &amp; New Year';
      const title = 'Bell&apos;s';
      const didl = {
        'upnp:album': album,
        'dc:title': title
      };
      const result = MetadataHelper.ParseDIDLTrack(didl, 'fake_host');
      expect(result).toHaveProperty('Album','Christmas & New Year');
      expect(result).toHaveProperty('Title', 'Bell\'s');
      done();
    });

    it('decodes numeric album', (done) => {
      const album = 19;
      const artist = 'Adele';
      const didl = {
        'upnp:album': album,
        'dc:creator': artist
      };
      const result = MetadataHelper.ParseDIDLTrack(didl, 'fake_host');
      expect(result).toHaveProperty('Album','19');
      expect(result).toHaveProperty('Artist', artist);
      done();
    });

    it('decodes spotify album art uri correctly', (done) => {
      const hostName = 'fake_host'
      const albumArt = '/getaa?s=1&amp;u=x-sonos-spotify%3aspotify%253atrack%253a0WS5DKZ6QnHvFYBk8lRRm0%3fsid%3d9%26flags%3d8224%26sn%3d7';
      const expectedUri = `http://${hostName}:1400/getaa?s=1&u=x-sonos-spotify%3aspotify%253atrack%253a0WS5DKZ6QnHvFYBk8lRRm0%3fsid%3d9%26flags%3d8224%26sn%3d7`;
      const didl = {
        'upnp:albumArtURI': albumArt,
        'upnp:album': 'CeeLo&apos;s Magic Moment', 
        'dc:creator': 'CeeLo Green',
        'dc:title': 'This Christmas'
      };
      const result = MetadataHelper.ParseDIDLTrack(didl, 'fake_host');
      expect(result).toHaveProperty('Album', 'CeeLo\'s Magic Moment');
      expect(result).toHaveProperty('AlbumArtUri', expectedUri);
      expect(result).toHaveProperty('Artist', 'CeeLo Green');
      expect(result).toHaveProperty('Title', 'This Christmas');
      done();
    });

    it('parsed r:streamContent correctly 2', (done) => {
      const artist = 'Guus Meeuwis';
      const title = 'Brabant'
      const id = 'FAKE_ITEM_ID'
      const didl = {
        _id: id,
        'r:streamContent': `${artist} - ${title}`
      }
      const result = MetadataHelper.ParseDIDLTrack(didl, 'fake_host')
      expect(result).toBeDefined();
      expect(result).toHaveProperty('Artist', artist);
      expect(result).toHaveProperty('Title', title);
      expect(result).toHaveProperty('ItemId', id);
      done();
    })

    it('parsed r:streamContent and r:radioShowMd correctly', (done) => {
      const artist = 'Guus Meeuwis';
      const title = 'Brabant'
      const id = 'FAKE_ITEM_ID'
      const didl = {
        _id: id,
        'r:streamContent': artist,
        'r:radioShowMd': title
      }
      const result = MetadataHelper.ParseDIDLTrack(didl, 'fake_host')
      expect(result).toBeDefined();
      expect(result).toHaveProperty('Artist', artist);
      expect(result).toHaveProperty('Title', title);
      expect(result).toHaveProperty('ItemId', id);
      done();
    })

    it('parsed r:streamContent', (done) => {
      const artist = 'Guus Meeuwis';
      const id = 'FAKE_ITEM_ID'
      const didl = {
        _id: id,
        'r:streamContent': artist
      }
      const result = MetadataHelper.ParseDIDLTrack(didl, 'fake_host')
      expect(result).toBeDefined();
      expect(result).toHaveProperty('Artist', artist);
      expect(result).toHaveProperty('ItemId', id);
      done();
    });

    it('decodes r:resMD into the raw DIDL-Lite metadata of the underlying resource', (done) => {
      const innerDidl = '<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/"><item id="F00090020s106914" parentID="F000c0008s106914" restricted="true"><dc:title>Q-Dance Hard</dc:title><upnp:class>object.item.audioItem.audioBroadcast</upnp:class><desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">SA_RINCON65031_</desc></item></DIDL-Lite>';
      // As it arrives from the XML parser, still one level of html-entity-encoding away from innerDidl.
      const encodedResMd = innerDidl.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const didl = {
        'dc:title': 'Q-Dance Hard',
        'upnp:class': 'object.itemobject.item.sonos-favorite',
        'r:resMD': encodedResMd,
      };
      const result = MetadataHelper.ParseDIDLTrack(didl, 'fake_host');
      expect(result).toBeDefined();
      expect(result).toHaveProperty('ResMD', innerDidl);
      done();
    });

    it('leaves ResMD undefined when r:resMD is absent', (done) => {
      const didl = { 'dc:title': 'No favorite metadata here' };
      const result = MetadataHelper.ParseDIDLTrack(didl, 'fake_host');
      expect(result).toBeDefined();
      expect(result).toHaveProperty('ResMD', undefined);
      done();
    });
  });

  describe('TrackToMetaData', () => {
    it('includes resource', () => {
      const trackUri = 'https://cdn.smartersoft-group.com/various/pull-bell-short.mp3';
      const albumUri = 'https://avatars2.githubusercontent.com/u/1292510?v=4'
      const album = 'Just a Bell';
      const duration = '00:28:07';
      const fakeProtocolInfo = 'fake-protocol:*'
      const metadata = MetadataHelper.TrackToMetaData({
        ParentId: '11',
        TrackUri: trackUri,
        Duration: duration,
        AlbumArtUri: albumUri,
        Album: album,
        ProtocolInfo: fakeProtocolInfo
      }, true);
      expect(metadata).toBeDefined();
      expect(metadata).toContain(trackUri);
      expect(metadata).toContain(albumUri);
      expect(metadata).toContain(album);
      expect(metadata).toContain(duration);
      expect(metadata).toContain(fakeProtocolInfo);
    });

    it('returns emtpy string when track undefined', () => {
      const result = MetadataHelper.TrackToMetaData(undefined);
      expect(result).toEqual('');
    });
  });
});
