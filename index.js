/*jslint node: true, indent: 4 */

(function () {
    'use strict';
    var httpAccess = require('./httpAccess'),
        infoStruct = require('./jsonStruct'),
        infoFileMan = require('./infoFileManager'),

        exportsIF = {};

    function message(s) {
        console.log(s);
    }

    function booklogData(infoFolders, obj) {
        infoStruct(obj).forEachBook(function (bookInfo) {
            infoFolders.makeFolder(bookInfo, {
                success: function () {
                    message('gen file:' + bookInfo.title);
                },
                fail: function (err) {
                    message('gen file Error bookInfo Folder:' + bookInfo.title);
                    //message(err);
                }
            });
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
