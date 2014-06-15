/*jslint node: true, indent: 4 */
/* global module,console */
(function () {
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
    function extendArgs(param) {
        var count = 100;

        loopArgs(function (arg) {
            var
                prs = parseArg(arg),
                type = prs.type,
                val = prs.val;

            switch (type) {
            case 'C':
                count = val;
                break;
            }
        });

        return {
            userId:   param.userId,
            basePath: param.basePath,
            count: count
        };
    }
    module.exports = {
        extendArgs: extendArgs
    };
}());
