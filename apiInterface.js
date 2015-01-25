/*jslint node: true, indent: 4 */

var booklogFolderCtrl = require('./genBooklogFolder2'),
    setting_booklog = require('../setting/setting_booklog');

module.exports = (function () {
    'use strict';

    return function () {
        var bfc;
        bfc = booklogFolderCtrl({
            basePath: setting_booklog.basePath,
            userId: setting_booklog.userId,
            defaultCount: 100
         });

        return {
            genFolder: bfc.genFolder,
            genFolderAsync: bfc.genFolderAsync,
        };
    };
}());

