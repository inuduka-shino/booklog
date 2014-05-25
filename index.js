/*jslint node: true, indent: 4 */
/* global module,console */
(function () {
    'use strict';
    var httpAccess = require('./httpAccess'),
        infoStruct = require('./jsonStruct'),
        makeInfoFileMan = require('./makeInfoFile'),
        setting = require('../ownCookingSetting.js'),

        makeInfoFile = makeInfoFileMan.setBasePath(setting.basePath);

    function booklogData(obj) {
        infoStruct(obj).forEachBook(function (bookInfo) {
            makeInfoFile(bookInfo);
        });
    }
    module.exports = {
        get: httpAccess.get.bind(null, booklogData)
    };
}());
