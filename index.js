var dgram = require('dgram')
var net = require('net')

exports.udp_echo_server = function(opt) {
    var s = dgram.createSocket('udp4');

    s.on('error', function(err) {
        console.log('error: ' + err.message)
    })

    s.on('listening', function() {
        var address = s.address()
        console.log('listening ip=' + address.address + ' port=' + address.port)
    })

    s.on('message', function(msg, rinfo) {
        console.log('message from ip=' + rinfo.address + ' port=' + rinfo.port)
        if (opt.mode === 'normal') {
            s.send(msg, 0, msg.length, rinfo.port, rinfo.address)            
        }
        else if (opt.mode === 'random') {
            send_with_random_socket(msg, rinfo.port, rinfo.address)
        }
    })

    s.bind(opt.port, opt.host)

    function send_with_random_socket(msg, port, address) {debugger
        var rs = dgram.createSocket('udp4')
        
        rs.on('listening', function() {debugger
            rs.send(msg, 0, msg.length, port, address, function() {
                rs.close()
            })
        })

        rs.on('error', function(err) {
            console.log('[send_with_random_socket] ' + err.toString())
        })

        rs.bind() // on random port
    }
}

exports.test_udp_echo_server = function(opt) {
    var s = dgram.createSocket('udp4');
    var id = 0

    s.on('error', function(err) {
        console.log('error: ' + err.message)
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

exports.tcp_echo_server = function(opt) {
    var s = net.createServer()

    s.on('error', function(err) {
        console.log('error: ' + err.message)
    })

    s.on('listening', function() {
        var address = s.address()
        console.log('listening ip=' + address.address + ' port=' + address.port)
    })

    s.on('connection', function(client) {
        var address = client.address()
        console.log('connection from ip=' + address.address + ' port=' + address.port)

        client.on('data', function(chunk) {
            console.log('client data length=' + chunk.length)
            client.write(chunk)
        })

        client.on('close', function() {
            console.log('client close')
        })

        client.on('error', function(err) {
            console.log('client error: ' + err.message)
        })
    })

    s.on('close', function() {
        console.log('close')
    })

    s.listen(opt.port, opt.host)
}

exports.test_tcp_echo_server = function(opt) {
    var s = net.connect(opt.port, opt.host)
    var id = 0

    s.on('error', function(err) {
        console.log('error: ' + err.message)
    })

    s.on('connect', function() {
        console.log('connect ip=' + s.remoteAddress + ' port=' + s.remotePort)
        send_next()
    })

    s.on('data', function(chunk) {
        console.log('receive from ip=' + s.remoteAddress + ' port=' + s.remotePort + 'content=' + JSON.stringify(chunk.toString()))
        setTimeout(send_next, 1000)
    })

    s.on('close', function() {
        
    })

    function send_next() {
        var msg = new Buffer('hello ' + (id++))
        console.log('send to ip=' + s.remoteAddress + ' port=' + s.remotePort + ' content=' + JSON.stringify(msg.toString()))
        s.write(msg)
    }
}