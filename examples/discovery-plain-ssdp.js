// This test file doesn't use the sonos library. Instead it uses plain sockets just to debug discovery. 

// see https://github.com/svrooij/node-sonos-ts/issues/150#issuecomment-1006086581
// credits: https://gist.github.com/chrishulbert/895382
const dgram = require('dgram') 

// Broadcast to specific address, port with specific message
const PORT = 1900
const ADDRESS = '239.255.255.250'
// Alternatives - both work for SONOS. First provides only the group!
// ST urn:smartspeaker-audio:service:SpeakerGroup:1
// ST urn:schemas-upnp-org:device:ZonePlayer:1
//
// To discover also NON-SONOS devices use:
// ST ssdp:all
// 
// MAN should use " " although SONOS works without.
const messageAsBuffer = Buffer.from( 
  'M-SEARCH * HTTP/1.1\r\n'
      + `HOST: ${ADDRESS}:${PORT}\r\n`
      + 'MAN: "ssdp:discover"\r\n'
      + 'MX: 1\r\n'
      + 'ST: urn:schemas-upnp-org:device:ZonePlayer:1\r\n',
)

const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true })
// set up error, listening, messages
socket.on('error', (err) => {
  console.log(JSON.stringify(err))
  socket.close()
})
socket.on('listening', () => { 
  // following are not needed
  // socket.setBroadcast(true)
  // socket.addMembership(ADDRESS)
  // socket.setMulticastTTL(128)
  console.log('Start listening ...')
})
socket.on('message', (msg, rinfo) => {
  // msg is buffer and contains line breaks. 
  const msgArray = msg.toString().split(/\r\n|\n|\r/)
  // LOCATION is in line 4 -> so it is number 3
  console.log(rinfo.address + '-->' + msgArray[3].replace('LOCATION: ', '').trim())
})

// bind with random port and send broadcast. bind is async!
socket.bind(() => {
  console.log('random port:' + socket.address().port)
  
  socket.send(messageAsBuffer, 0, messageAsBuffer.length, PORT, ADDRESS, (err) => {
    if (err) {
      console.log(JSON.stringify(err))
      socket.close()
    } else {
      console.log('OK broadcast was sent!')
    }
  })
})
