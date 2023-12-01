var fetch = require("node-fetch");

exports.execute = function (verb, url, token, json_string, callback) {
    var _type = ""
    var _response_code = ""
    var _url = url
    var opts = {}
    if (token) {
        opts = {
            method: verb,
            body: json_string,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        }
    } else {
        opts = {
            method: verb,
            body: json_string,
            headers: {
                'Content-Type': 'application/json'
            },
        }
    }
    fetch(url, opts)
        .then(
            function (response) {
                if (response.ok) {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        _type = "json"
                        _response_code = response.status.toString()
                        return response
                    } else {
                        _type = "text"
                        _response_code = response.status.toString()
                        return response
                    }
                } else {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        _type = "json_error"
                        _response_code = response.status.toString()
                        return response
                    } else {
                        _type = "text_error"
                        _response_code = response.status.toString()
                        return response
                    }

                }
            }
        ).then(function (res) {
            if (_type === "json") {
                return res.json()
            } else if (_type === "text") {
                return res.text()
            } else if (_type === "json_error") {
                return res.json()
            } else if (_type === "text_error") {
                return res.text()
            } else {
                return res
            }
        }).then(function (res) {

            if (_response_code === "200" || _response_code === "201") {
                console.log('NODEFETCH::EVENT::SUCCESS - ' + 'Type:[' + _type + ']' + ' - Code:[' + _response_code + '] ' + ' - Uri:[' + _url + '] ');
                callback(res, false, _response_code)

            } else {
                if (_type === "json_error") {
                    console.log('NODEFETCH::EVENT::FAIL - ' + 'Type:[' + _type + ']' + ' - Code:[' + _response_code + '] ' + ' - Uri:[' + _url + '] ' + ' - Error:[' + res.error + '] ');
                    callback(res.error, true, _response_code)
                } else {
                    console.log('NODEFETCH::EVENT::FAIL - ' + 'Type:[' + _type + ']' + ' - Code:[' + _response_code + '] ' + ' - Uri:[' + _url + '] ');
                    callback(res, true, _response_code)
                }
            }
        }).catch(
            function (err) {
                callback(err, true, 500)
            }
        )

};

exports.execute_async = async function (verb, url, token, json_string) {
    var _type = ""
    var _response_code = ""
    var _url = url
    var opts = {}
    if (token) {
        opts = {
            method: verb,
            body: json_string,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
        }
    } else {
        opts = {
            method: verb,
            body: json_string,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }
    }
    const res = await fetch(url, opts).then(function (response) {
        if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                _type = "json"
                _response_code = response.status.toString()
                return response
            } else {
                _type = "text"
                _response_code = response.status.toString()
                return response
            }
        } else {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                _type = "json_error"
                _response_code = response.status.toString()
                return response
            } else {
                _type = "text_error"
                _response_code = response.status.toString()
                return response
            }

        }
    }).then(function (res) {
        if (_type === "json") {
            if (_response_code.toString() === '204') {
                return ""
            } else {
                return res.json()
            }
        } else if (_type === "text") {
            return res.text()
        } else if (_type === "json_error") {
            return res.json()
        } else if (_type === "text_error") {
            return res.text()
        } else {
            return res
        }
    }).then(function (res) {
        if (_response_code === "200" || _response_code === "201") {
            var msg = 'NODEFETCH::EVENT::SUCCESS - ' + 'Type:[' + _type + ']' + ' - Code:[' + _response_code + '] ' + ' - Uri:[' + _url + '] ';
            console.log(msg)
            if (res.data) {
                var result = {
                    "status": "200",
                    "data": res.data
                }
                return result
            } else {
                var result = {
                    "status": "200",
                    "data": res
                }
                return result
            }

        } else {
            if (_type === "json_error") {
                var msg = 'NODEFETCH::EVENT::FAIL - ' + 'Type:[' + _type + ']' + ' - Code:[' + _response_code + '] ' + ' - Uri:[' + _url + '] ' + ' - Error:[' + JSON.stringify(res.error) + '] ';
                console.log(msg)
                var result = {
                    "status": _response_code,
                    "data": res.error // this has not been tested
                }
                return result
            } else if (_type === "json") {
                if (_response_code === "204") {
                    var msg = 'NODEFETCH::EVENT::FAIL - ' + 'Type:[' + _type + ']' + ' - Code:[' + _response_code + '] ' + ' - Uri:[' + _url + '] ';
                    console.log(msg)
                    var result = {
                        "status": _response_code,
                        "data": msg
                    }
                    return result
                }
            } else {
                var msg = 'NODEFETCH::EVENT::FAIL - ' + 'Type:[' + _type + ']' + ' - Code:[' + _response_code + '] ' + ' - Uri:[' + _url + '] ';
                console.log(msg)
                var result = {
                    "status": _response_code,
                    "data": msg // this has not been tested
                }
                return result
            }
        }
    }).catch(function (err) {

        if (err.type) {
            _type = err.type
        }
        if (err.code) {
            _response_code = err.code
        }
        var err_msg = 'NODEFETCH::EVENT::EXCEPTION - ' + 'Type:[' + _type + ']' + ' - Code:[' + _response_code + '] ' + ' - Uri:[' + _url + '] ' + ' - Error:[' + err.message + '] '
        console.log(err_msg);
        var result = {
            "status": "500",
            "data": err_msg,
            "statusText": err_msg
        }
        return result
    });

    var return_json = {
        success: false,
        data: null,
        httpStatusCode: 500,
    }

    if (res) {
        if (res.status) {
            if (res.status.toString() === "200") {
                console.log(res)
                return_json.success = true
                return_json.data = res.data
                return_json.httpStatusCode = 200
            } else {
                console.log(res)
                return_json.success = false
                return_json.data = res.data
                return_json.httpStatusCode = (res.status) * 1
            }
        } else {
            return_json.success = false
            return_json.data = "Unknown error occured!"
            return_json.httpStatusCode = 500
        }
    } else {
        return_json.success = false
        return_json.data = "Unknown error occured!"
        return_json.httpStatusCode = 500
    }

    return return_json;
};