/*jslint node: true, indent: 4 */
/* global module,console */
(function () {
    'use strict';
    var commandArgments;

    commandArgments = (function () {
    // command arg1 arg2 -opt1 -opt2:val2 opt3:val3 -opt4 val4 arg3
    // -opt4 の次がargかvalかは、引数の解釈依存

        function parseArg(arg, argsContext) {
            var name, value,
                normalArgCount = 0,
                optFlag = false,
                cs,
                optStruct;

            if (argsContext.optionMode !== undefined) {
                optFlag = true;
                name = argsContext.optionMode;
                value = arg;

                argsContext.optionMode = undefined;
            } else {
                if (arg[0] === '-') {
                    name = arg = arg.slice(1);
                    value = undefined;
                    optFlag = true;
                }
                cs = arg.indexOf(':');
                if (cs !== -1) {
                    if (optFlag) {
                        name = arg.slice(1, cs - 1);
                    } else {
                        optFlag = true;
                        name = arg.slice(0, cs - 1);
                    }
                    value = arg.slice(cs + 1);
                }
            }

            if (optFlag === true) {
                name.toUpperCase(),
                return {
                    name: name,
                    val: val
                };
            } else {
                if (value !== undefined) {
                }
            }

        }

        function init(cntxt, args) {
            var
                argsLen = args.length,
                i,
                argsContext = {
                    optionMode = undefined
                }
                normalArgs, options;

            normalArgs = cntxt.normalArgs = [];
            options = cntxt.options = [];

            // args[0]: "node"
            // args[1]: script file path
            for (i = 2; i < argsLen; i += 1) {
                var argPair;
                argPair = parseArg(args[i], argsContext);
                if (argPair === undefined) {
                    continue;
                } else if (argPair.arg !== undefined) {
                    normalArgs.push(argPair.arg);
                } else {
                    options.push({
                        name: argPair.name,
                        value: argPair.value
                    });
                }
            }
            cntxt.argsEach = function (func) {
                normalArgs.forEach(function (val) {
                    func(val);
                });
            }
            cntxt.opetionsEach = function (func) {
                options.each(function (val) {
                    func(val);
                });
            }

        }

        function genArgs(cntxt) {
            return {
                each: cntxt.argsEach
            };
        }
        function genOptions(cntxt) {
            return {
                each: cntxt.opetionsEach
            };
        }
        return function (args) {
            var cntxt = {};
            init(cntxt, args);
            return {
                args: genArgs(cntxt),
                options: genOptions(cntxt),
        };

    }());

    function setting(param) {
        var defaultCount = 100,

            args = commandArgments(param.args),

            userId = param.userId,
            basePath = param.basePath,
            count = param.count;

        if (count === undefined) {
            count = defaultCount;
        }

        // コマンド引数　優先
        args.options.each(function (opt) {
            var
                name = opt.name,
                val = opt.val;

            switch (name) {
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
    }

    module.exports =  setting;
}());
