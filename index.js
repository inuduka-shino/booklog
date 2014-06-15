/*jslint node: true, indent: 4 */

(function () {
    'use strict';
    var
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
        var infoFolders,
            bklogAccess;

        infoFolders = infoFileMan.init({
            basePath: param.basePath
        });
        bklogAccess = httpAccess({
            userId: param.userId
        });

        bklogAccess.setCount(param.count);

        bklogAccess.get(booklogData.bind(null, infoFolders));
        // message('command exit');
    };

    module.exports = exportsIF;

}());
