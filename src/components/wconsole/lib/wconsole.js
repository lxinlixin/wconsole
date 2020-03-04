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
        // const that = this;
        const methodList = ['log', 'info', 'warn', 'error'];

        if (!console) {
            window.console = {};
        } else {
            methodList.forEach(method => {
                this.console[method] = console[method];
            });
            this.console.time = console.time;
            this.console.timeEnd = console.timeEnd;
            this.console.clear = console.clear;
        }
        console.store = {
            state: [],
            systemLog: [],
            switchPosition: {
                bottom: '100px',
                right: '10px',
            },
        };

        methodList.forEach(method => {
            console[method] = (...args) => {
                this.printLog({
                    logType: method,
                    logs: args,
                });
            };
        });

        const timeLog = {};
        console.time = label => {
            timeLog[label] = Date.now();
        };
        console.timeEnd = label => {
            const pre = timeLog[label];
            if (pre) {
                console.log(`${label}:${Date.now() - pre}ms`);
                delete timeLog[label];
            } else {
                console.log(`${label}: 0ms`);
            }
        };

        console.clear = (...args) => {
            this.clearLog();
            this.console.clear.apply(console, args);
        };
    }
    /**
     * print a log to log box
     * @private
     */
    printLog(item) {
        let logs = item.logs || [];
        if (!logs.length) {
            return;
        }
        // copy logs as a new array
        logs = [].slice.call(logs || []);
        // 处理console.log(a,b,c)这样的情况
        // 分别执行console.log(a);console.log(b);console.log(c)
        for (let i = 0; i < logs.length; i++) {
            console.store.state.push({
                data: logs[i],
                type: item.logType.slice(0, 1).toUpperCase() + item.logType.slice(1),
            });
            try {
                this.console[item.logType](logs[i]);
            } catch (e) {
                console.error('原生的console出错了,出错信息如下:');
                console.error(e.message);
            }
        }
    }
}

export default Wconsole;
