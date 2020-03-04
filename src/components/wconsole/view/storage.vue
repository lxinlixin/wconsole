<template>
    <div class="wcon-storage">
        <top-bar
         :optTypes="optTypes"
         :topbars="topTypes"
         @changeTopbar="changeTopType"></top-bar>

        <scroller class="wcon-content">
            <text class="wcon-storage_empty" v-if="!localStorage.length">empty</text>
            <div v-else>
                <div class="wcon-storage-item wcon-storage-item_head">
                    <text class="wcon-storage-item_key">Name</text>
                    <text class="wcon-storage-item_value">Value</text>
                </div>
                <div :class="['wcon-storage-item', (index % 2) ? 'wcon-storage-item_odd' : '']" v-for="(item, index) in localStorage" :key="`wcon-localstorage_${item.key}`">
                    <text class="wcon-storage-item_key" @click="copy(item.key)">{{item.key}}</text>
                    <div class="wcon-storage-item_value" @click="copy(item.value)">
                        <!-- typeof array/object === object -->
                        <show-logs v-if="typeof getValue(item.value) === 'object'"
                            :logs="getValue(item.value)"
                            type='storage'>
                        </show-logs>
                        <text v-else>{{getValue(item.value)}}</text>
                    </div>
                </div>
            </div>
        </scroller>
    </div>
</template>

<script>
import showLogs from '../components/showLogs.vue';
import topBar from '../components/topbar.vue';

const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
const clipboard = weex.requireModule('clipboard')

export default {
    name: "Storage",
    components: {
        showLogs,
        topBar,
    },
    data() {
        return {
            localStorage: [], // localStorage数据
            localStorageKeys: [], // localStorage缓存的所有key组成的数组
            topTypes: [ 'clear', 'refresh'],
            optTypes: [ 'clear', 'refresh'],
        };
    },
    created() {
        this.getLocalstorageAll(); // 获取所有localStorage数据
    },
    methods: {
        changeTopType(type) {
            if (type === 'refresh') {
                // refresh localStorage
                this.localStorage = []; // 初始化localStorage
                this.getLocalstorageAll(); // 重新获取所有localStorage数据
            } else if (type === 'clear') {
                // clear localStorage
                // 清除之前弹窗确认
                if (this.localStorage.length === 0) {
                    return;
                }
                modal.confirm({
                    message: '清除所有缓存？', // this.current.currentToolbar,
                    okTitle: 'ok',
                    cancelTitle: 'cancel',
                }, value => {
                    if (value === 'ok') {
                        this.removeLocalstorageAll();
                    }
                });
            }
        },
        setLocalstorageItem(key, value) {
            storage.setItem(key, value, event => {
            })
        },
        getLocalstorageAll() {
            storage.getAllKeys(event => {
                if (event.result === "success") {
                    const keys = event.data;
                    this.localStorageKeys = keys;
                    keys.forEach(item => {
                        this.getLocalstorageItem(item);
                    });
                }
            });
        },
        getLocalstorageItem(key) {
            storage.getItem(key, event => {
                this.localStorage.push({
                    key,
                    value: event.data,
                });
            });
        },
        removeLocalstorageAll() {
            this.localStorageKeys.forEach((key, index) => {
                this.removeLocalstorageItem(key, index);
            });
            this.localStorageKeys = []; // 清除所有keys
            this.localStorage = []; // 清除所有用于展现的localstorage
            modal.alert({
                message: '清除成功!',
                okTitle: '确认',
            }, function () {
                console.log('clear localStroage success!');
            });
        },
        removeLocalstorageItem(key, index) {
            storage.removeItem(key, event => {
                // delete localStorage[key];
            });
        },
        getValue(value) {
            try {
                return JSON.parse(value);
            } catch (err) {
                return value || '-';
            }
        },
        copy(str) {
            clipboard.setString(str);
            modal.alert({
                message: '复制成功',
                okTitle: '确认',
            }, function () {
                console.log(str);
            });
        },
    },
};
</script>

<style lang="less">
@import "./content.less";

.wcon-storage {
    &-item {
        display: flex;
        background: lightyellow;
        flex-direction: row;
        align-items: stretch;
        &_head {
            background: powderblue;
        }
        &_odd {
            background: pink;
        }
        &_key {
            width: 150px;
        }
        &_value {
            width: 200px;
            padding-left: 10px;
            margin-left: 10px;
            border-left: 1px gray solid;
        }
    }
}
</style>