/*jslint node: true, indent: 4 */
var genBookLogFolders = require('./genBooklogFolder'),
    argments = require('./argments');

module.exports = function (param) {
    'use strict';
    return {
        genBookLogFolders:  genBookLogFolders
            .bind(null, argments(param))
    };
};
