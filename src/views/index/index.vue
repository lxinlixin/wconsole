<template>
<div class="wconsole-wrapper">
    <list>
        <header><text class='wconsole-wrapper__header-text'>wconsole介绍</text></header>
        <cell class='wconsole-wrapper__cell'><text>支持object嵌套显示</text></cell>
        <cell class='wconsole-wrapper__cell'><text>支持console.log,error,warn,info</text></cell>
        <cell class='wconsole-wrapper__cell'><text>解决客户端没有console，monitor信息查看不方便的问题</text></cell>
        <cell class='wconsole-wrapper__cell'><text>后续根据需要考虑加入原生报错的支持</text></cell>
        <cell class='wconsole-wrapper__cell'><text>后续加入cookie,localstorage,saveValue的支持</text></cell>
        <cell class='wconsole-wrapper__cell'><text>加入element显示（根据需要）</text></cell>
        <cell class='wconsole-wrapper__cell' @click="onclick"><text>点击这里push到test页面</text></cell>
        <!-- <cell class='wconsole-wrapper__cell' v-for="n in 20" :key="n"><text>{{ n }}</text></cell> -->
    </list>
</div>
</template>

<style>
.wconsole-wrapper{
    padding: 16px!important;
}
.wconsole-wrapper__header-text{
    color:skyblue;
    font-size: 24px;
}
.wconsole-wrapper__cell{
    border-bottom: 1px solid #eeeeee;
    margin-bottom: 10px;
    padding: 10px;
}
</style>

<script>
export default {
    data() {
        return {
            test: 111,
            text: 'You are running Vue in development mode.Make sure to turn on production mode when deploying for production.See more tips at https://vuejs.org/guide/deployment.html',
        };
    },
    created() {
        // console.log('测试Log');
        const q = {
            a: '循环对象也可以展示',
            b: 2,
        };
        q.test = q;
        console.log(q);
        console.log('index页面created的输出');
    },
    mounted() {
        // console.log(this.$data);
        // console.warn('测试Warn');
        // console.warn(function test(){return 1+1===2});

        // console.error('测试Error');
        // console.error('something is error');

        // console.info('测试info');
        // console.info({
        //     info1: 'wconsole终于能看了',
        //     info2: '这才是weex调试的终极解决方案？',
        // });
        console.log('index页面mounted的输出');
        const q = {
            a() {},
            b() {},
        };
        console.log(q.a, q.b, {
            a: 1,
            b: 2,
        });
    },
    methods: {
        onclick() {
            this.$router.push('test');
        },
    },
};
</script>