<template>
    <div class="wcon-topbar">
        <div
            :class="[
                'wcon-topbar-item',
                currentTopbar===topbar ? 'wcon-topbar-item_active' : '',
                ~optTypes.indexOf(topbar) ? 'wcon-topbar-item_opt' : '',
            ]"
            v-for="(topbar, index) in topbars"
            :key="index"
            @click="topbaeChange(topbar)">
            <text class='wcon-topbar-item-txt'>{{topbar}}</text>
        </div>
    </div>
</template>

<script>
export default {
    name: 'top-bar',
    props: {
        topbars: { type: Array, default: ()=>[] },
        optTypes: { type: Array, default: ()=>[] },
        currentTopbar: { type: String, default: '' }
    },
    methods: {
        topbaeChange(val) {
            this.$emit('changeTopbar', val);
        },
    }
}
</script>

<style lang='less'>
.wcon-topbar {
    background-color: #FBF9FE;
    height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    &-item {
        height: 30px;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-left: 5px;
        padding-right: 5px;
        border-bottom-color: #FBF9FE;
        border-bottom-width: 0px;
        &-txt {
            text-align: center;
            height: 20px;
            font-size: 14px;
        }
        &_active {
            height: 31px;
            border-bottom: 2px solid #3e82f7;
        }
        &_opt {
            border-radius: 6px;
            background-color: lavender;
        }
    }
}
</style>