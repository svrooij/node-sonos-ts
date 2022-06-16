# Music services

This is the current work-in-progress of support for external music services.

I always wanted support for external music services in node-sonos, but never got to it. The main thing I'm trying to accomplish it to **Search external services**, like the normal sonos controller apps can.
So have it check the available services, pick one by name and search for some music.

## Current status

- [x] Connect to music services without authentication (mainly radio services).
- [x] Search radio stations
- [ ] Browse for all stations
- [ ] Search for artists
- [X] Connect to music service with authentication (need help, or sonos insider please contact me :wink:)

Challenges:

1. SMAPI protocol is badly [documented](https://developer.sonos.com/build/content-service-get-started/playback-on-sonos/).
2. Client authentication, from the app/user perspective isn't documented at all (if you found the documentation, please let me know).
3. Service 'Capabilities' aren't documented, I suspect a [bitmask](https://dev.to/somedood/bitmasks-a-very-esoteric-and-impractical-way-of-managing-booleans-1hlf).
4. Sonos controller app directly connects to MusicService [SMAPI](https://developer.sonos.com/build/content-service-get-started/soap-requests-and-responses/) server over https, so no way to sniff traffic.
5. Sonos controller app "loads" credentials from somewhere, not sure where they are stored or how to retrieve.

## Current services

Each music service has certain capabilities, like `search` and `Requires Device Certificate`. Since all the capabilities are stored in a single integer, I suspect a bitmask of sorts.

```plain
 ID  Name                       Auth                 Mask                    Capabilities
 38  7digital                   UserId                513                      1000000001
198  Anghami                    DeviceLink           2627                    101001000011
204  Apple Music                AppLink           3117633          1011111001001001000001
275  ARTRADIO - RadioArt.com    UserId                513                      1000000001
306  Atmosphere by Kollekt.fm   AppLink           4194816         10000000000001000000000
239  Audible                    AppLink           1095249           100001011011001010001
219  Audiobooks.com             UserId               4672                   1001001000000
157  Bandcamp                   DeviceLink            513                      1000000001
307  Bookmate                   AppLink            197184              110000001001000000
283  Calm                       AppLink            102976               11001001001000000
144  Calm Radio                 UserId                512                      1000000000
256  CBC Radio &amp; Music      Anonymous          594496            10010001001001000000
191  Classical Archives         DeviceLink        1030739            11111011101001010011
 24  DAR.fm Record Radio        UserId                512                      1000000000
  2  Deezer                     DeviceLink       25180755       1100000000011101001010011
234  deliver.media              DeviceLink            512                      1000000000
285  Epidemic Spaces            AppLink             66048               10000001000000000
182  FamilyStream               UserId             537153            10000011001001000001
217  FIT Radio Workout Music    DeviceLink           4610                   1001000000010
192  focus@will                 UserId               5632                   1011000000000
167  Gaana                      DeviceLink            577                      1001000001
279  Global Player              Anonymous             577                      1001000001
151  Google Play Music          DeviceLink          98899               11000001001010011
 36  Hearts of Space            UserId                512                      1000000000
 45  hotelradio.fm              UserId                512                      1000000000
271  IDAGIO                     AppLink            602688            10010011001001000000
300  JUKE                       AppLink           5050945         10011010001001001000001
305  Libby by OverDrive         AppLink            627264            10011001001001000000
221  LivePhish+                 UserId               6675                   1101000010011
260  Minidisco                  UserId                512                      1000000000
181  Mixcloud                   DeviceLink           2627                    101001000011
171  Mood Mix                   UserId               4609                   1001000000001
262  My Cloud Home              AppLink             33281                1000001000000001
268  myTuner Radio              Anonymous             513                      1000000001
203  Napster                    UserId                595                      1001010011
277  NRK Radio                  Anonymous           37377                1001001000000001
230  NTS Radio                  Anonymous             512                      1000000000
222  nugs.net                   UserId             531027            10000001101001010011
212  Plex                       AppLink           1937985           111011001001001000001
233  Pocket Casts               AppLink           1028672            11111011001001000000
265  PowerApp                   Anonymous             512                      1000000000
301  Primephonic                AppLink               577                      1001000001
 31  Qobuz                      AppLink             10835                  10101001010011
294  Radio Javan                AppLink            528897            10000001001000000001
308  Radio Paradise             AppLink           4198912         10000000001001000000000
264  radio.net                  Anonymous          889409            11011001001001000001
154  Radionomy                  Anonymous               0                               0
162  radioPup                   Anonymous             513                      1000000001
223  RauteMusik.FM              Anonymous             513                      1000000001
270  Relisten                   Anonymous            4672                   1001001000000
150  RUSC                       UserId                512                      1000000000
164  Saavn                      DeviceLink          12865                  11001001000001
303  Sonos Radio                Anonymous        12583425        110000000000001000000001
160  SoundCloud                 DeviceLink           4611                   1001000000011
189  SOUNDMACHINE               UserId                513                      1000000001
218  Soundsuit.fm               UserId                512                      1000000000
295  Soundtrack Player          AppLink          13632001        110100000000001000000001
  9  Spotify                    AppLink           5310995         10100010000101000010011
163  Spreaker                   Anonymous             513                      1000000001
184  Stingray Music             DeviceLink         295427             1001000001000000011
 13  Stitcher                   UserId               4675                   1001001000011
237  storePlay                  UserId             328193             1010000001000000001
226  Storytel                   UserId             636481            10011011011001000001
235  Sveriges Radio             Anonymous           70145               10001001000000001
211  The Music Manager          UserId                515                      1000000011
174  TIDAL                      DeviceLink          47699                1011101001010011
169  Tribe of Noise             DeviceLink           4672                   1001001000000
254  TuneIn                     Anonymous            4161                   1000001000001
193  Tunify for Business        UserId               8769                  10001001000001
231  Wolfgang&apos;s Music      UserId             537153            10000011001001000001
272  Worldwide FM               Anonymous             512                      1000000000
284  YouTube Music              AppLink          32473609       1111011111000001000001001

first position = Search
7th position = Account logging ?
10th position = Extended metadata

13th position = Receive actions for getMediaUri
```

List generated by running:

```js
sonos.MusicServicesList().then(services => {
  console.log(' ID  Name                       Auth                 Mask                    Capabilities')
  services.forEach(s => {
    const cap = parseInt(s.Capabilities)
    console.log('%s  %s\t%s\t%s\t%s', s.Id.toString().padStart(3, ' '), s.Name.padEnd(20, ' '), s.Policy.Auth.padEnd(9, ' '), s.Capabilities.toString().padStart(9, ' '), cap.toString(2).padStart(25, ' '))
  })
}).catch(console.error)
```

## Help wanted

I'm looking for people that know their way around Wireshark to figure out how the Sonos Contoller app (on PC or phone) gets the credentials to send to the several smapi services.

The main goals is to be able to search/browse all music services, and play the songs from all those sources. Apart from that if I figured out how to get the authentication to work, I still need people to test the client on their paid music services, since I'm not subscribing to all of them just to test stuff out.
