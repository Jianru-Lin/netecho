module.exports = function(err, result) {
    if (err) {
        console.error(err.toString())
    }
    else {
        console.log(stringify(result))
    }
}

function stringify(v) {
    if (v === null || v === undefined) {
        return ''
    }
    // number, boolean, object
    else if (!Buffer.isBuffer(v)) {
        try {
            return JSON.stringify(v, null, 4)
        }
        catch (err) {
            return v.toString()
        }
    }
    // Buffer
    else {
        return v.toString('hex')
    }
}