/*jslint node: true, indent: 4 */
/*global Promise */

var httpAccess = require('./httpAccess'),
    infoStruct = require('./jsonStruct'),
    infoFileMan = require('./infoFileManager');

/* Promise Object version for makeBookSupporter */

module.exports = (function () {
    'use strict';

    /*
    function message(s) {
        console.log(s);
    }
    */

    function genError(message, subname) {
        var err = new Error();
        err.message = message;
        err.name = 'bookLogFolderError';
        err.subname = subname;
        return err;
    }

    function getBookLogInfo(bklogAccess) {
        return new Promise(function (resolve) {
            bklogAccess.get()
                .then(function (bklogInfo) {
                    resolve(bklogInfo);
                });
        });
    }

    function makeBookLogFolders(infoFolders, bklogInfo) {
        var iStruct = infoStruct(bklogInfo),
            promises = [];

        //message('booklogData');
        if (iStruct.size() === 0) {
            return Promise.resolve('no entry');
        }
        iStruct.forEachBook(function (bookInfo) {
            var infoFolder = infoFolders.infoFolder(bookInfo);

            promises.push(new Promise(function (resolve, reject) {

                infoFolder.exist({
                    success: function (exist) {
                        if (exist) {
                            //reject(genError('exist file', 'EXISTFILE'));
                            resolve('exist folder:' + bookInfo.title);
                        } else {
                            infoFolder.makeFolder({
                                success: function () {
                                    resolve('gen folder:' + bookInfo.title);
                                },
                                fail: function () {
                                    reject(genError(
                                        'gen folder Error bookInfo Folder:' +
                                            bookInfo.title,
                                        'MAKE_FOLDER'
                                    ));
                                }
                            });
                        }
                    },
                    fail: function () {
                        reject(genError(
                            'file Access Error!:' + bookInfo.title,
                            'ACCESS_FILE'
                        ));
                    }
                });
            }));

        }); // end of forEach

        return Promise.all(promises);
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
