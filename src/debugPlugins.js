/*
    debugPlugins：Vue插件，但是依赖于weex的Modal模块
    要解决的问题：
    1. 手机版没有console.log，调试不方便
    2. weex中的modal.toast可以提供信息的展示，但是前者会直接淹没后者，同时发生的只会展示一条
    3. toast中的message必须是string
    4. 调试完毕在发布到正式环境时需要将toast代码移除或注释
    最终效果：
    1. 队列处理，同时发生的toast会按照顺序依次展示
    2. message处理，对象直接使用JSON.stringify进行处理
    3. 环境判断，当不为开发环境的时候，可以静默处理，调试完毕之后不需要删除toast代码
    使用方法：
    1. Vue.prototype.$toast(message,duration)
    2. 在.vue文件中使用 this.$toast(message,duration)
    参数说明
    1. message: 对象或者字符串
    2. duration: 单位为ms
    特殊值处理
    1. 当输入message为undefined时，会输出字符串的undefined
    2. 为''也就是空字符串时，输出汉字字符"空字符串"
*/
const Modal = weex.requireModule('modal');
const debugPlugins = {};

debugPlugins.install = Vue => {
    if (process.env.NODE_ENV === 'development') {
        const arrs = [];
        let isToasting = false;
        Vue.prototype.$toast = function $toast(...args) {
            if (args.length !== 0) {
                let message;
                const duration = args[1] || 1000;
                switch (args[0]) {
                case undefined: message = 'undefined'; break;
                case '': message = '空字符串'; break;
                default: message = args[0];
                }
                arrs.push({
                    message,
                    duration,
                });
            }
            if (!isToasting && arrs.length > 0) {
                const arr = arrs.shift();
                isToasting = true;
                Modal.toast({
                    message: typeof arr.message === 'string' ? arr.message : JSON.stringify(arr.message),
                    duration: arr.duration / 1000,
                });
                setTimeout(() => {
                    isToasting = false;
                    Vue.prototype.$toast();
                }, arr.duration);
            }
        };
    } else {
        Vue.prototype.$toast = () => {};
    }
};

module.exports = debugPlugins;
