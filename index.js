/*jslint node: true, indent: 4 */

(function () {
    'use strict';
    var httpAccess = require('./httpAccess'),
        infoStruct = require('./jsonStruct'),
        infoFileMan = require('./infoFileManager'),

        exportsIF = {};

    function booklogData(infoFolders, obj) {
        infoStruct(obj).forEachBook(function (bookInfo) {
            infoFolders(bookInfo);
        });
    }

    exportsIF.genBookLogFolders = function (param) {
        var infoFolders;

        infoFolders = infoFileMan.init({
            basePath: param.basePath
        });

        httpAccess.get(booklogData.bind(null, infoFolders));
    };

    module.exports = exportsIF;

}());
