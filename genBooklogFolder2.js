/*jslint node: true, indent: 4 */

var httpAccess = require('./httpAccess'),
    infoStruct = require('./jsonStruct'),
    infoFileMan = require('./infoFileManager');

module.exports = (function () {
    'use strict';

    function message(s) {
        console.log(s);
    }

    function booklogData(infoFolders, obj) {
        var iStruct = infoStruct(obj);
        //message('booklogData');
        if (iStruct.size() === 0) {
            message('no enty!');
            return;
        }
        iStruct.forEachBook(function (bookInfo) {
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

    return function (param) {
        var infoFolders,
            bklogAccess;

        infoFolders = infoFileMan.init({
            basePath: param.basePath
        });
        bklogAccess = httpAccess({
            userId: param.userId
        });

        bklogAccess.setCount(param.defaultCount);

        function genFolderAsync(bklogAccessCount) {
            var ret;
            if (bklogAccessCount !== undefined) {
                bklogAccess.setCount(bklogAccessCount);
            }
            ret = bklogAccess.get()
                .then(function (bklogInfo) {
                    booklogData(infoFolders, bklogInfo);
                })
                .promise();
            // message('command exit');

            return ret;
        }

        return {
            genFolder: function (bklogAccessCount) {
                if (bklogAccessCount !== undefined) {
                    bklogAccess.setCount(bklogAccessCount);
                }
                bklogAccess.get(booklogData.bind(null, infoFolders));
            },
            genFolderAsync: genFolderAsync
        };
    };

}());
