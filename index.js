/*jslint node: true, indent: 4 */

(function () {
    'use strict';
    var
        config = require('config'),

        httpAccess = require('./httpAccess'),
        infoStruct = require('./jsonStruct'),
        infoFileMan = require('./infoFileManager'),

        exportsIF = {};

    function message(s) {
        console.log(s);
    }

    function booklogData(infoFolders, obj) {
        infoStruct(obj).forEachBook(function (bookInfo) {
            var infoFolder = infoFolders.infoFolder(bookInfo);

            infoFolder.exist({
                success: function (exist) {
                    if (exist) {
                        message('exist file:' + bookInfo.title);
                    } else {
                        infoFolder.makeFolder({
                            success: function () {
                                message('gen file:' + bookInfo.title);
                            },
                            fail: function () {
                                message('gen file Error bookInfo Folder:' + bookInfo.title);
                                //message(err);
                            }
                        });
                    }
                },
                fail: function () {
                    message('file Access Error!:' + bookInfo.title);
                }
            });
        });
    }

    exportsIF.genBookLogFolders = function (param) {
        var infoFolders;

        message("config test:" + config.test)
        message("basePath test:" + config.basePath)

        infoFolders = infoFileMan.init({
            //basePath: param.basePath
            basePath: config.basePath
        });

        httpAccess.get(booklogData.bind(null, infoFolders));
        message('command exit');

    };

    module.exports = exportsIF;

}());
