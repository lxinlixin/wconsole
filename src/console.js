/*eslint-disable*/

class Wconsole {
    constructor() {
        this.console = {};
        this.mockConsole();
    }

    /**
     * replace console with wConsole method
     * @private
     */
    mockConsole() {
        const that = this;
        const methodList = ['log', 'info', 'warn', 'error'];

        if (!console) {
            console = {};
        } else {
            methodList.map(function(method) {
                that.console[method] = console[method];
            });
            that.console.time = console.time;
            that.console.timeEnd = console.timeEnd;
            that.console.clear = console.clear;
        }
        console.store = {
          state:[]
        };

        methodList.map(method => {
            console[method] = (...args) => {
                this.printLog({
                    logType: method,
                    logs: args,
                });
            };
        });

        const timeLog = {}
        console.time = function(label) {
            timeLog[label] = Date.now();
        };
        console.timeEnd = function(label) {
        var pre = timeLog[label];
        if (pre) {
            console.log(label + ':', (Date.now() - pre) + 'ms');
            delete timeLog[label];
        } else {
            console.log(label + ': 0ms');
        }
        };

        console.clear = (...args) => {
            that.clearLog();
            that.console.clear.apply(console, args);
        };
    }
    /**
     * print a log to log box
     * @protected
     * @param  string  tabName    auto|default|system
     * @param  string  logType    log|info|debug|error|warn
     * @param  array   logs       `logs` or `content` can't be empty
     * @param  object  content    `logs` or `content` can't be empty
     * @param  boolean noOrigin
     * @param  boolean noMeta
     * @param  int     date
     * @param  string  style
     * @param  string  meta
     */
    printLog(item) {
        let logs = item.logs || [];
        if (!logs.length) {
          return;
        }
        // copy logs as a new array
        logs = [].slice.call(logs || []);
        console.store.state.push({
          data: logs.length===1?logs[0]:logs,
          type: item.logType.slice(0,1).toUpperCase()+item.logType.slice(1),
        });
        this.console[item.logType](...item.logs);
    }
}

export default Wconsole;
