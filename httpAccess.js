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
    function get(cntxt, func) {
        var
            count = cntxt.count,
            userId = cntxt.userId,

            req;

        req = http.request(
            {
                host: 'api.booklog.jp',
                port: 80,
                //path: '/json/maskinkk?status=2&count=' + count,
                path: '/json/' + userId + '?status=2&count=' + count,
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
