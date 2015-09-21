/*jslint node: true, indent: 4 */
/*global Promise */

var httpAccess = require('./httpAccess'),
    infoStruct = require('./jsonStruct'),
    infoFileMan = require('./infoFileManager');

/* Promise Object version for makeBookSupporter */

module.exports = (function () {
    'use strict';

    function message(s) {
        console.log(s);
    }

    function makeBookLogFolders(infoFolders, bklogInfo) {
        var iStruct = infoStruct(bklogInfo),
            promises = [];

        //message('booklogData');
        if (iStruct.size() === 0) {
            message('no enty!');
            return;
        }
        iStruct.forEachBook(function (bookInfo) {
            var infoFolder = infoFolders.infoFolder(bookInfo);

            promises.push(new Promise(function (resolve, reject) {

                infoFolder.exist({
                    success: function (exist) {
                        if (exist) {
                            message('exist file:' + bookInfo.title);
                            reject('exist file:' + bookInfo.title);
                        } else {
                            infoFolder.makeFolder({
                                success: function () {
                                    message('gen file:' + bookInfo.title);
                                    resolve('gen file:' + bookInfo.title);
                                },
                                fail: function () {
                                    message('gen file Error bookInfo Folder:' + bookInfo.title);
                                    reject('gen file Error bookInfo Folder:' + bookInfo.title);
                                }
                            });
                        }
                    },
                    fail: function () {
                        message('file Access Error!:' + bookInfo.title);
                    }
                });
            }));

        }); // end of forEach

        return Promise.all(promises);
    }

    function getBookLogInfo(bklogAccess) {
        return new Promise(function (resolve) {
            bklogAccess.get()
                .then(function (bklogInfo) {
                    resolve(bklogInfo);
                });
        });
    }

    function genFolderAsync(infoFolders, bklogAccess, bklogAccessCount) {
        if (bklogAccessCount !== undefined) {
            bklogAccess.setCount(bklogAccessCount);
        }
        return getBookLogInfo(bklogAccess) // resolve(bklogInfo)
            .then(makeBookLogFolders.bind(null, infoFolders));
    }


    return function (param) {
        return {
            genFolderAsync: genFolderAsync.bind(
                null,
                infoFileMan.init({
                    basePath: param.basePath
                }),
                httpAccess({
                    userId: param.userId
                }).setCount(param.defaultCount)
            )
        };
    };

}());
