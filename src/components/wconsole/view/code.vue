<template>
    <div class="wcon-code">
        <top-bar
         :optTypes="optTypes"
         :topbars="topTypes"
         @changeTopbar="clickTopbar"></top-bar>

        <scroller class="wcon-content">
            <textarea v-if="update" ref="codeinput" :class="['wcon-code-input', isIOS?'wcon-code-input_ios':'']" @input="inputChange" placeholder="Type JavaScript here"></textarea>

            <div class="wcon-code-list">
                <div class="wcon-code-item" v-for="(item, index) in codeList" :key="index">
                    <div class="wcon-code-row">
                        <text class="color0086b3 font16">></text>
                        <text class="color0086b3 wcon-code-content">{{item.in}}</text>
                    </div>
                    <div class="wcon-code-row">
                        <text class="color333 font16"><</text>
                        <text class="color333 wcon-code-content">{{item.out}}</text>
                    </div>
                </div>
            </div>
        </scroller>
    </div>
</template>

<script>
import topBar from '../components/topbar.vue';
import { isIOS } from '../lib/env';
const storage = weex.requireModule("storage");

export default {
    name: 'Wcode',
    components: {
        topBar,
    },
    data() {
        return {
            isIOS,
            codeStr: '',
            topTypes: [ 'clear', 'cancel', 'execute'],
            optTypes: [ 'clear', 'cancel', 'execute' ],
            codeList: [],
            inputCode: '',
            update: true,
            localStorageKey: 'wconsole_codelist',
        };
    },
    mounted() {
        this.getLocalstorageItem(this.localStorageKey);
    },
    methods: {
        clickTopbar(type) {
            if (type === 'clear') {
                // 清除codeList
                this.codeList=[];
                this.removeLocalstorageItem(this.localStorageKey);
            } else if (type === 'cancel') {
                // 清除输入框
                this.inputCode = '';
                this.update = false;
                this.$nextTick(() => {
                    this.update = true
                })
            } else if (type === 'execute') {
                // 执行代码
                if (!this.inputCode) {
                    return;
                }
                console.log(this.inputCode);
                const codeItem = {};
                codeItem.in = this.inputCode.replace(/(\n)/g, '');
                codeItem.out = eval(codeItem.in) || 'undefined';
                console.log(codeItem.out);
                this.codeList.unshift(codeItem);
                this.setLocalstorageItem(this.localStorageKey, JSON.stringify(this.codeList));

                this.inputCode = '';
                this.update = false;
                this.$nextTick(() => {
                    this.update = true
                })
            }
        },
        inputChange(event) {
            this.inputCode = event.value;
        },
        setLocalstorageItem(key, value) {
            storage.setItem(key, value, event => {
            })
        },
        getLocalstorageItem(key) {
            storage.getItem(key, event => {
                try {
                    this.codeList = JSON.parse(event.data);
                } catch (err) {
                    this.codeList = [];
                }
            });
        },
        removeLocalstorageItem(key, index) {
            storage.removeItem(key, event => {
            });
        },
    },
}
</script>

<style lang="less">
@import "./content.less";
.wcon-code {
    &-list {
        padding: 0 6px;
    }
    &-input {
        margin: 0 3px;
        padding: 0 6px;
        border: 1px solid darkcyan;
        border-radius: 6px;
        &_ios {
            height: 120px;
        }
    }
    &-row {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        height: 30px;
    }
    &-content {
        height: 30px;
        margin-left: 6px;
        font-size: 16px;
        line-height: 30px;
    }
}

.color0086b3 {
    color: #0086b3;
}
.color333 {
    color: #333;
}
.font16 {
    font-size: 16px;
}
</style>