var dgram = require('dgram')

exports.udp_echo_server = function(opt) {
    var s = dgram.createSocket('udp4');

    s.on('error', function(err) {
        console.log(err.toString())
    })

    s.on('listening', function() {
        var address = s.address()
        console.log('listening ip=' + address.address + ' port=' + address.port)
    })

    s.on('message', function(msg, rinfo) {
        console.log('message from ip=' + rinfo.address + ' port=' + rinfo.port)
        s.send(msg, 0, msg.length, rinfo.port, rinfo.address)
    })

    s.bind(opt.port, opt.host)
}

exports.udp_robot = function(opt, cb) {

}