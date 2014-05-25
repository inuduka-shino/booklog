/*jslint node: true, indent: 4 */
/* global module,console */
(function () {
    'use strict';
    var fs = require('fs'),
        fsFolderMan,
        genInfoFolder,

        exportIF;

    module.exports = exportIF = {};

    /*
    function trace(s) {
        console.log('trace>' + s);
    }
    */

    fsFolderMan = (function () {
        var badAlphabet = '/:*?"<>|\\.~',
            goodAlphabet = '／：＊？”＜＞|＼．～',
            badAlphabetSize = badAlphabet.length,
            fileInfoName = 'xinfo.txt';

        function transFilename(fn) {
            var i, j, c, cc,
                fnSize = fn.length,
                newFn = '';
            fn = fn.trim();
            for (i = 0; i < fnSize; i += 1) {
                c = fn[i];
                cc = undefined;
                for (j = 0; j < badAlphabetSize; j += 1) {
                    if (c === badAlphabet[j]) {
                        cc = goodAlphabet[j];
                    }
                }
                if (cc === undefined) {
                    newFn += c;
                } else {
                    newFn += cc;
                }
            }
            return newFn;
        }


        function makeFolder(ctxtIF, handler) {
            var path = ctxtIF.folderPath;
            fs.mkdir(path, function (err) {
                var error;
                if (err) {
                    error = 'mkdir error!:' + path;
                    //console.log(error);
                    //console.log(err);
                    handler.fail(error);
                } else {
                    handler.success();
                }
            });
        }
        function fileName(ctxtIF) {
            return ctxtIF.fileName;
        }
        function exist(ctxtIF, handler) {
            fs.exists(ctxtIF.folderPath, function (exists) {
                if (exists === true) {
                    handler.success(true);
                } else if (exists === false) {
                    handler.success(false);
                } else {
                    handler.fail(exists);
                }
            });
        }
        function writeInfo(ctxtIF, contents, handler) {
            var infoFilePath = ctxtIF.infoFilePath;

            fs.writeFile(infoFilePath, contents, function (err) {
                var error;
                if (err) {
                    error = 'write file error!:' + infoFilePath;
                    console.log(error);
                    console.log(err);
                    handler.fail(error);
                } else {
                    // console.log('gen file:' + bookInfo.title);
                    handler.success();
                }
            });
        }


        function fsFolderManImpl(param) {
            var ctxtIF = {},
                path,
                fn;

            ctxtIF.fileName =
                fn = transFilename(param.title);
            ctxtIF.folderPath =
                path = param.basePath + '/' + fn;
            ctxtIF.infoFilePath = path + '/' + fileInfoName;

            return {
                makeFolder: makeFolder.bind(undefined, ctxtIF),
                fileName: fileName.bind(undefined, ctxtIF),
                writeInfo: writeInfo.bind(undefined, ctxtIF),
                exist: exist.bind(undefined, ctxtIF)
            };
        }
        return fsFolderManImpl;
    }());

    genInfoFolder = (function () {

        function exist(ctxtIFD, handler) {
            return ctxtIFD.fsFolder.exist(handler);
        }

        function makeFolder(ctxtIFD, handler) {
            var fsFolder = ctxtIFD.fsFolder;

            fsFolder.makeFolder({
                success: function () {
                    var info;

                    info = '[booklogInfo]\n';
                    info += 'ISBN:' + ctxtIFD.isbn + '\n'; //本当はASIN
                    info += 'タイトル:' + ctxtIFD.title + '\n';
                    info += '著者:' + ctxtIFD.author + '\n';
                    info += 'ファイル名:' + fsFolder.fileName() + '\n';

                    fsFolder.writeInfo(info, {
                        success: function () {
                            handler.success();
                        },
                        fail: function (err) {
                            handler.fail('writeInfo Error ! \n' + err);
                        }
                    });
                },
                fail: function (err) {
                    handler.fail('makeFolder Error ! \n' + err);
                }
            });
        }

        function genInfoFolderImpl(ctxtIFS, bookInfo) {
            var fsFolder = fsFolderMan({
                    basePath: ctxtIFS.basePath,
                    title: bookInfo.title
                }),
                ctxtIFD = {
                    fsFolder: fsFolder,
                    isbn: bookInfo.isbn,
                    title: bookInfo.title,
                    author: bookInfo.author
                };

            return {
                exist: exist.bind(undefined, ctxtIFD),
                makeFolder: makeFolder.bind(undefined, ctxtIFD)
            };
        }
        return genInfoFolderImpl;
    }());

    function makeFolder(ctxtIFS, bookInfo, handler) {
        var fsFolder = fsFolderMan({
                basePath: ctxtIFS.basePath,
                title: bookInfo.title
            }),
            info;

        fsFolder.makeFolder({
            success: function () {
                info = '[booklogInfo]\n';
                info += 'ISBN:' + bookInfo.isbn + '\n'; //本当はASIN
                info += 'タイトル:' + bookInfo.title + '\n';
                info += '著者:' + bookInfo.author + '\n';
                info += 'ファイル名:' + fsFolder.fileName() + '\n';

                fsFolder.writeInfo(info, {
                    success: function () {
                        handler.success();
                    },
                    fail: function (err) {
                        handler.fail('writeInfo Error ! \n' + err);
                    }
                });
            },
            fail: function (err) {
                handler.fail('makeFolder Error ! \n' + err);
            }
        });

    }

    function makeInfoFolders(param) {
        var ctxtIFS = {
            basePath: param.basePath
        };

        return {
            makeFolder: makeFolder.bind(undefined, ctxtIFS),
            infoFolder: genInfoFolder.bind(undefined, ctxtIFS)
        };
    }

    exportIF.init = function (param) {
        return makeInfoFolders(param);
    };

}());
