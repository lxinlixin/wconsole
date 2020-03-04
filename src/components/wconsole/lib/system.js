import Wconsole from './wconsole.js';

class System extends Wconsole {

    constructor(...args) {
        super(...args);
        this.printSystemLog();
    }

    printSystemLog() {
        // print system info
        let wxenvironment = WXEnvironment || weex.config.env,
            bundleUrl = weex.config.bundleUrl,
            logMsg = '';
            
        // osVersion 
        console.store.systemLog.push({
            type: 'Info',
            data: `OsVersion: ${wxenvironment.osVersion}`,
        });

        // deviceModel
        console.store.systemLog.push({
            type: 'Info',
            data: `DeviceModel: ${wxenvironment.deviceModel}`,
        });

        // User Agent
        console.store.systemLog.push({
            type: 'Info',
            data: `Url: ${bundleUrl}`,
        });

        // 开发框架
        console.store.systemLog.push({
            type: 'Info',
            data: `frameType: ${weex.config.bundleType}`,
        });

        // weexVersion
        console.store.systemLog.push({
            type: 'Info',
            data: `weexVersion: ${wxenvironment.weexVersion}`,
        });

        // appInfo
        console.store.systemLog.push({
            type: 'Info',
            data: `appInfo: ${wxenvironment.appName}, ${wxenvironment.appVersion}`,
        });

        // deviceSize
        console.store.systemLog.push({
            type: 'Info',
            data: `deviceSize: ${wxenvironment.deviceWidth}, ${wxenvironment.deviceHeight}`,
        });

        // performance related
        // use `setTimeout` to make sure all timing points are available
        // weex无法直接获取performance，需要客户端支持:https://weex.apache.org/zh/guide/extend/extend-android.html#adapter-%E6%B3%A8%E5%86%8C
        setTimeout(function () {
            console.store.systemLog.push({
                type: 'Info',
                data: `performance: 开发中`,
            });
        }, 0);
    }

}

export default System;