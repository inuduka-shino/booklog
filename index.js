/*jslint node: true, indent: 4 */

(function () {
    'use strict';
    var httpAccess = require('./httpAccess'),
        infoStruct = require('./jsonStruct'),
        makeInfoFileMan = require('./makeInfoFile'),

        exportsIF = {};

    function booklogData(makeInfoFile, obj) {
        infoStruct(obj).forEachBook(function (bookInfo) {
            makeInfoFile(bookInfo);
        });
    }

    exportsIF.genBookLogFolders = function (param) {
        var makeInfoFile;

        makeInfoFile = makeInfoFileMan.init({
            basePath: param.basePath
        });

        httpAccess.get(booklogData.bind(null, makeInfoFile));
    };

    module.exports = exportsIF;

}());
