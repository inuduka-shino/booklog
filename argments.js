/*jslint node: true, indent: 4 */
/* global module,console */

module.exports = (function () {
    'use strict';

    function loopArgs(func) {
        var args = process.argv,
            argsLen = args.length,
            i,
            modeCntxt;

        // args[0]: "node"
        // args[1]: script file path
        for (i = 2; i < argsLen; i += 1) {
            modeCntxt = func(args[i], modeCntxt);
        }
    }
    function parseArg(arg) {
        var type, val,
            argStruct;

        argStruct = arg.split(':');
        type = (argStruct[0]).toUpperCase();
        val = argStruct[1];

        return {
            type: type,
            val: val
        };
    }
    return function (settingPath) {
        var defaultCount = 100,
            param = require(settingPath + 'booklog.js'),

            userId = param.userId,
            basePath = param.basePath,
            count = param.count;
        console.log(param);

        if (count === undefined) {
            count = defaultCount;
        }

        // コマンド引数　優先
        loopArgs(function (arg) {
            var
                prs = parseArg(arg),
                type = prs.type,
                val = prs.val;

            switch (type) {
            case 'C':
            case 'COUNT':
                count = val;
                // console.log('set Count:' + val);
                break;
            }
        });

        return {
            userId:   userId,
            basePath: basePath,
            count: count
        };
    };
}());
