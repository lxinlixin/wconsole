<template>
    <div class="wcon-system">
        <top-bar
            :topbars="topTypes"
            :currentTopbar="currentTopbar"
            @changeTopbar="changeTopType"
        ></top-bar>

        <scroller class="wcon-content">
            <show-logs v-for='(obj,index) in logsData' 
                v-if="currentTopbar==='All' || currentTopbar===obj.type"
                :logs="obj.data"
                :key="'log_'+index"
                :type='obj.type'
                :class="[`wcon-content-${obj.type}`]">
            </show-logs>
        </scroller>
    </div>
</template>

<script>
import showLogs from '../components/showLogs.vue';
import topBar from '../components/topbar.vue';

export default {
    name: 'SystemLog',
    components: {
        showLogs,
        topBar,
    },
    data() {
        return {
            currentTopbar: 'All',
            topTypes: [ 'All', 'Log', 'Info', 'Warn', 'Error'],
            logsData: console.store.systemLog,
        };
    },
    methods: {
        changeTopType(val) {
            this.currentTopbar = val;
        },
    }
}
</script>

<style lang="less">
@import "./content.less";
</style>