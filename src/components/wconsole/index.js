import Wconsole from './lib/wconsole.js';
import System from './lib/system.js';
import wConsole from './view/wconsole.vue';
import { isWeexWeb } from './lib/env.js';

// 只要不是线上环境，就进行显示
if (process.env.BUILD_ENV !== 'prod') {
    if (isWeexWeb) {
        // 如果是在web端，则不执行console的重写，直接使用浏览器的console观察即可
        // 浏览器本身有控制台，是不需要的
        // 此时展示引导信息即可
        console.store = {
            state: [
                {
                    data: 'web端不开放wconsole功能',
                    type: 'Info',
                },
                {
                    data: '请使用浏览器自带控制台观察数据即可',
                    type: 'Info',
                },
            ],
            systemLog: [
                {
                    data: 'web端不开放wconsole功能',
                    type: 'Info',
                },
                {
                    data: '请使用浏览器performance观察数据即可',
                    type: 'Info',
                },
            ],
            // 初始化wconsole按钮位置
            switchPosition: {
                bottom: '100px',
                right: '10px',
            },
        };
    } else if (!console.store) {
        // 保证重写console只执行一次，
        // 因为weex端每次都会重新重写一次console，会导致console被多次重写
        // eslint-disable-next-line
        // new Wconsole(); // 在system里已经通过继承执行了，在此不需要重复执行
        new System();
    }
    // eslint-disable-next-line
    function mount() {
        const { body } = (typeof window !== 'undefined' ? window : weex).document;
        const el = isWeexWeb ? document.createElement('div') : 'body';
        if (body) {
            if (el.parentNode !== body) {
                const instance = new Vue({
                    el,
                    render: h => h(wConsole),
                });
                body.appendChild(instance.$el);
            }
        } else {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
                el.parentNode = null;
            }
            // 采用nextTick的方式进行挂载，优化用户使用体验
            Vue.nextTick(mount);
        }
    }
    // 反复执行挂载函数，直到dom创建完成自动插入wconsole组件，达到用户无感接入
    mount();
}
