/*jslint node: true, indent: 4 */
var genBookLogFolders = require('./genBooklogFolder');

module.exports = function (settingPath) {
    'use strict';
    return {
        genBookLogFolders:  genBookLogFolders
            .bind(null, settingPath)
    };
};
