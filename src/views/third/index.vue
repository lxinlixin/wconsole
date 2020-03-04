<template>
<div class="wconsole-wrapper">
    <list>
        <header><text class='wconsole-wrapper__header-text'>这是third页面</text></header>
        <cell class='wconsole-wrapper__cell'><text>这个页面是为了测试pop，push可能带来的问题(已经解决,原因是clear之后带来的不显示问题)</text></cell>
        <cell class='wconsole-wrapper__cell'><text>以前的问题是push两次之后再pop，就不会有输出</text></cell>
        <cell class='wconsole-wrapper__cell'><text>这个页面是从test页面push进来的</text></cell>
        <cell class='wconsole-wrapper__cell'><text>此时点击下面这个文字，就pop到test页面</text></cell>
        <cell class='wconsole-wrapper__cell'><text @click="$router.pop('test')">pop到test页面</text></cell>
        <cell class='wconsole-wrapper__cell'><text @click="$router.push('index')">push到index页面</text></cell>
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
            test:111,
        };
    },
    created() {
        console.log('third页面created的输出');
    },
    mounted() {
        console.log('third页面mounted之后的输出');
    }
};
</script>