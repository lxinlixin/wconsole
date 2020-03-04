<template>
    <div class="wcon-wrapper" >
        <!-- mask -->
        <div :class="['wcon-mask',  showConsole?'wcon-mask-active':'']" 
            @click="toggleShowConsole"></div>
        
        <!-- panel -->
        <div :class="['wcon-panel', showConsole?'wcon-panel-active':'']" ref="wpanel">
            <!-- tabbar -->
            <div class="wcon-tabbar">
                <div class="wcon-tabbar-item"
                    v-for="(tabbar, index) in tabbars"
                    :key="index"
                    :style="{
                        backgroundColor: currentTabbar===tabbar?'#ffffff':'#EFEFF4',
                    }"
                    @click="currentTabbar = tabbar">
                    <text 
                        :style="{
                            color: currentTabbar===tabbar?'#000000':'#808080',
                        }"
                        class='wcon-tabbar-txt'
                        >{{tabbar}}
                    </text>
                </div>
            </div>

            <!-- tabContent -->
            <Logs v-if="currentTabbar === 'Log'"></Logs>
            <SystemLog v-if="currentTabbar === 'System'"></SystemLog>
            <Storage v-if="currentTabbar === 'Storage'"></Storage>
            <Wcode v-if="currentTabbar === 'Code'"></Wcode>
        </div>

        <!-- switch -->
        <div v-if="!isWeexWeb" :class="['wcon-switch', showConsole?'wcon-switch_on':'']" 
            @click="toggleShowConsole"
            @panmove="onPanMove"
            @panstart="onPanStart"
            @panend="onPanEnd"
            ref="wswitch">
            <text class="wcon-switch-txt">wConsole</text>
        </div>
        <div v-else class="wcon-switch wcon-nonetouch" 
            @click="toggleShowConsole"
            @touchstart.native="onPanStart"
            @touchmove.native="onPanMove"
            @touchend.native="onPanEnd"
            ref="wswitch">
            <text class="wcon-switch-txt">wConsole</text>
        </div>
    </div>
</template>

<style lang="less" src='./wconsole.less'>
</style>

<script>
import { isWeexWeb, isIOS } from '../lib/env.js';
import Logs from './logs';
import SystemLog from './systemLog';
import Storage from './storage';
import Wcode from './code';

let node;
const dom = weex.requireModule('dom');

export default {
    components: {
        Logs,
        SystemLog,
        Storage,
        Wcode,
    },
    data() {
        return {
            showConsole: false,
            isWeexWeb,
            currentTabbar: 'Log',
            tabbars: [
                'Log',
                'System',
                'Storage',
                'Code',
            ],
            panelHeight: 1060,
            panelWidth: 750,
        };
    },
    mounted() {
        node = this.$refs.wswitch.$el || this.$refs.wswitch;

        if (isWeexWeb) {
            node.style.bottom = console.store.switchPosition.bottom;
            node.style.right = console.store.switchPosition.right;
        } else {
            node.setStyles(console.store.switchPosition);
        }
    },
    methods: {
        toggleShowConsole() {
            this.showConsole = !this.showConsole;
        },
        onPanStart(e) {
            this.lastPosition = {
                x: e.changedTouches[0].pageX,
                y: e.changedTouches[0].pageY,
            };
            this.isMoving = false;
        },
        onPanMove(e) {
            this.movePosition(e, 'move');
            
            this.lastPosition = {
                x: e.changedTouches[0].pageX,
                y: e.changedTouches[0].pageY,
            };
        },
        onPanEnd(e) {
            this.movePosition(e, 'end');
        },
        movePosition(e, type) {
            const right = Number(console.store.switchPosition.right.split('p')[0]);
            const bottom = Number(console.store.switchPosition.bottom.split('p')[0]);
            const moveX = e.changedTouches[0].pageX - this.lastPosition.x;
            const moveY = e.changedTouches[0].pageY - this.lastPosition.y;
            console.store.switchPosition.right = right - moveX;
            console.store.switchPosition.bottom = bottom - moveY;
            this.handleSwitchPosition();

            if (isWeexWeb) {
                node.style.bottom = console.store.switchPosition.bottom;
                node.style.right = console.store.switchPosition.right;
            } else if (isIOS || type === 'end') { // 安卓暂时不移动，会卡顿，省略中间移动过程
                node.setStyles(console.store.switchPosition);
            }
        },
        handleSwitchPosition() {
            let right = console.store.switchPosition.right;
            let bottom = console.store.switchPosition.bottom;

            if (isNaN(right)) {
                right = 10;
            } else if (right < 0) {
                right = 0;
            } else if (right > (this.panelWidth - 160)) { // pannel宽度减去按钮宽度
                right = this.panelWidth - 160;
            }

            if (isNaN(bottom)) {
                bottom = 10;
            } else if (bottom < 0) {
                bottom = 0;
            } else if (bottom > (this.panelHeight - 80)) { // pannel高度减去按钮高度
                bottom = this.panelHeight - 80;
            }

            console.store.switchPosition.right = right+'px';
            console.store.switchPosition.bottom = bottom+'px';
        }
    },
};
</script>