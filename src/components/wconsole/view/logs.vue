<template>
    <div class="wcon-log">
        <top-bar
         :optTypes="optTypes"
         :topbars="topTypes"
         :currentTopbar="currentTopbar"
         @changeTopbar="changeTopType"></top-bar>

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
    name: 'Logs',
    components: {
        showLogs,
        topBar,
    },
    data() {
        return {
            currentTopbar: 'All',
            topTypes: [ 'clear', 'All', 'Log', 'Info', 'Warn', 'Error'],
            optTypes: [ 'clear' ],
            logsData: console.store.state,
        };
    },
    methods: {
        changeTopType(val) {
            if (~this.optTypes.indexOf(val)) {
                return this.handleOpt(val);
            }
            this.currentTopbar = val;
        },
        handleOpt(type) {
            if (type === 'clear') {
                if (this.currentTopbar === 'All') {
                    console.store.state = [];
                } else {
                    let len = console.store.state.length;
                    for (let i = 0; i < len; i++) {
                        if (console.store.state[i].type === this.currentTopbar) {
                            console.store.state.splice(i, 1);
                            len--;
                            i--;
                        }
                    }
                }
                this.logsData = console.store.state;
            }
        }
    }
}
</script>

<style lang="less">
@import "./content.less";
</style>