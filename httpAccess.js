/*jslint node: true, indent: 4 */
/* global module,console */
(function () {
    'use strict';
    var http = require('http'),
        jQuery = require('jquery-deferred');
    function get(cntxt, func) {
        var
            dfr = jQuery.Deferred(),
            count = cntxt.count,
            userId = cntxt.userId,
            urlPath = '/json/' + userId + '?status=2&count=' + count,

            req;

        //console.log('access to booklog api:' + urlPath);
        req = http.request(
            {
                host: 'api.booklog.jp',
                port: 80,
                path: urlPath,
                method: 'GET'
            },
            function (res) {
                var dataPool = '';
                res.setEncoding('utf8');
                if (res.statusCode === 200) {
                    res.on('data', function (chunk) {
                        // console.log(chunk);
                        dataPool += chunk;
                    });
                    res.on('end', function () {
                        var dataInfo = JSON.parse(dataPool);
                        if (func !== undefined) {
                            func(dataInfo);
                        }
                        dfr.resolve(dataInfo);
                    });
                } else {
                    console.log('bad response.');
                    console.log('STATUS: ' + res.statusCode);
                    console.log('HEADERS: ' + JSON.stringify(res.headers));
                    dfr.reject({
                        error: 'bad response',
                        status: res.statusCode,
                        headers: JSON.stringify(res.headers)
                    });
                }
            }
        );

        req.on('error', function (e) {
            console.log('access Error with HTTP request: ' + e.message);
            dfr.reject({
                error: 'access error',
                message: e.message,
                exception: e
            });
        });

        req.end();

        return dfr.promise();
    }

    function setCount(cntxt, count) {
        cntxt.count = count;
        return cntxt.that;
    }

    module.exports = function (param) {
        var intrfc = {},
            cntxt = {
                userId: param.userId,
                count: 100,
                that: intrfc
            };

        intrfc.get = get.bind(null, cntxt);
        intrfc.setCount = setCount.bind(null, cntxt);
        return intrfc;
    };

}());
