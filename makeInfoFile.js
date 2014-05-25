/*jslint node: true, indent: 4 */
/* global module,console */
(function () {
    'use strict';
    var
        fs = require('fs'),
        badAlphabet = '/:*?"<>|\\.~',
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

    function makeInfoFile(basePath, bookInfo) {
        var path, title, fileName, infoFilePath, info;

        title = bookInfo.title;
        fileName = transFilename(title);
        bookInfo.folderName = fileName;
        path = basePath + '/' + fileName;
        infoFilePath = path + '/' + fileInfoName;
        // console.log(transFilename(badAlphabet));
        // console.log(path);
        // console.log(bookInfo);
        fs.mkdir(path, function (err) {
            if (err) {
                console.log('mkdir error!:' + path);
                console.log(err);
                //throw (err);
            } else {
                info = '[booklogInfo]\n';
                info += 'ISBN:' + bookInfo.isbn + '\n'; //本当はASIN
                info += 'タイトル:' + bookInfo.title + '\n';
                info += '著者:' + bookInfo.author + '\n';
                info += 'フォルダ名:' + bookInfo.folderName + '\n';

                fs.writeFile(infoFilePath, info, function (err) {
                    if (err) {
                        console.log('write file error!:' + infoFilePath);
                        console.log(err);
                        //throw (err);
                    } else {
                        console.log('gen file:' + bookInfo.title);
                    }
                });
            }
        });
    }
    function setBasePath(basePath) {
        return makeInfoFile.bind(null, basePath);
    }

    module.exports = {
        setBasePath: setBasePath
    };
}());
