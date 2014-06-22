/*jslint node: true, indent: 4 */

(function () {
    'use strict';
    var
        httpAccess = require('./httpAccess'),
        infoStruct = require('./jsonStruct'),
        infoFileMan = require('./infoFileManager'),
        processArgs = require('./processArgs'),

        exportsIF = {};


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

    function genBookLogFolders(param) {
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
    }

    exportsIF.setParam = function (param0) {
        var param;

        param = processArgs(param0);

        return {
            genBookLogFolders:  genBookLogFolders.bind(null, param)
        };
    };

    module.exports = exportsIF;

}());
