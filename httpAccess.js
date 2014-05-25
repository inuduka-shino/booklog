/*jslint node: true, indent: 4 */
/* global module,console */
(function () {
    'use strict';
    var http = require('http');
    /*
        urlParamList = [
            '&count=98',
            '&count=99',
            '&count=100',
            '&count=101'
        ],
        urlParamListSize = urlParamList.length,
        i;
    function genUrlParam() {
        var ii = (typeof i === 'number') ? (i % urlParamListSize) : 0,
            urlParam = urlParamList[ii];
        i = ii + 1;
        return urlParam;
    }
    */
    module.exports = {
        get: function (func) {
            var req;

            req = http.request(
                {
                    host: 'api.booklog.jp',
                    port: 80,
                    path: '/json/maskinkk?status=2&count=25',
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
                            func(JSON.parse(dataPool));
                        });
                    } else {
                        console.log('bad response.');
                        console.log('STATUS: ' + res.statusCode);
                        console.log('HEADERS: ' + JSON.stringify(res.headers));
                    }
                }
            );

            req.on('error', function (e) {
                console.log('access Error with HTTP request: ' + e.message);
            });

            req.end();
        }
    };
}());
