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

exports.test_udp_echo_server = function(opt) {
    var s = dgram.createSocket('udp4');
    var id = 0

    s.on('error', function(err) {
        console.log(err.toString())
    })

    s.on('listening', function() {
        var address = s.address()
        console.log('listening ip=' + address.address + ' port=' + address.port)
        send_next()
    })

    s.on('message', function(msg, rinfo) {
        console.log('receive from ip=' + rinfo.address + ' port=' + rinfo.port + ' content=' + JSON.stringify(msg.toString()))
        setTimeout(send_next, 1000)
    })

    s.bind()

    function send_next() {
        var msg = new Buffer('hello ' + (id++))
        console.log('send to host=' + opt.host + ' port=' + opt.port + ' content=' + JSON.stringify(msg.toString()))
        s.send(msg, 0, msg.length, opt.port, opt.host)  
    }
}