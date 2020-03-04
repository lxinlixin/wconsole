<template>
<div class='wcon-logcontent'>
    <div v-if="tool.isObject(logs) || tool.isArray(logs)">
        <div class='wcon-logcontent-outer'
            @click="toggle=!toggle">
            <text>{{toggle?'▼':'▶'}}</text>
            <text :class="['wcon-logcontent-outer__text--margin',
                'wcon-logcontent-text-key']" 
                v-if="!tool.isUndefined(objKey)">{{objKey}}</text>
            <text class="wcon-logcontent-outer__text--italic wcon-flex-1"
                :class="[`wcon-logcontent-outer__text--${type}`]">{{outer}}</text>
        </div>
        <!-- 递归组件实现信息展示 -->
        <show-logs v-if="toggle"
            v-for="(log,key,index) in logs" 
            :logs="log" 
            :key='index'
            :objKey='key'
            :type='type'
            class="wcon-logcontent-inner--margin">
        </show-logs>
    </div>
    <div v-else-if="tool.isFunction(logs)">
        <text class='wcon-logcontent-function'>{{'function '+logs.name+'()'}}</text>
    </div>
    <div v-else class='wcon-logcontent-text'>
        <text :class="['wcon-logcontent-text-key','wcon-logcontent-text--margin']"
            v-if="!tool.isUndefined(objKey)">{{objKey+':'}}</text>
        <text class="wcon-flex-1"
            :class='code'>{{myLog}}</text>
    </div>
</div>
</template>

<script>
import * as tool from '../lib/tool.js';

export default {
    name: 'show-logs',
    props: ['logs', 'objKey', 'type'],
    data() {
        return {
            tool,
            toggle: false,
            myLog: this.logs,
            previewLength: this.type === 'storage' ? 22 : 26,
        };
    },
    computed: {
        outer() {
            if (tool.isArray(this.logs)) {
                return `Array [${this.logs.length}]`;
            }
            // 封装jsonstringify, 支持循环对象
            const json = tool.JSONStringify(this.logs);
            let preview = json.substr(0, this.previewLength);
            let outer = tool.getObjName(this.logs);
            if (json.length > this.previewLength) {
                preview += '...';
            }
            outer += ` ${preview}`;
            // eslint-disable-next-line
            return outer.replace(/[\n|\ |\t]/g, ' ');
        },
        code() {
            if (tool.isObject(this.logs) || tool.isArray(this.logs)) {
                return '';
            }
            let valueType;
            if (tool.isString(this.logs)) {
                valueType = 'string';
                this.myLog = `"${this.logs}"`;
            } else if (tool.isNumber(this.logs)) {
                valueType = 'number';
            } else if (tool.isBoolean(this.logs)) {
                valueType = 'boolean';
            } else if (tool.isNull(this.logs)) {
                valueType = 'null';
                this.myLog = 'null';
            } else if (tool.isUndefined(this.logs)) {
                valueType = 'undefined';
                this.myLog = 'undefined';
            } else if (tool.isFunction(this.logs)) {
                valueType = 'function';
                this.myLog = 'function()';
            }
            return [`wcon-logcontent-text-${valueType}`, 'wcon-logcontent-text--margin'];
        },
    },
};
</script>

<style lang='less'>
.wcon-flex-1{
    flex: 1;
}
.wcon-logcontent{
    &-outer{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        &__text--italic{
            font-style: italic;
            lines: 1;
            text-overflow: ellipsis;
        }
        &__text--margin{
            margin-right: 6px!important;
        }
        &__text--Log{
            color: #000000;
        }
        &__text--Error{
            color: #dc143c;
        }
        &__text--Warn{
            color: orange;
        }
        &__text--Info{
            color: #6a5acd;
        }
    }
    &-inner--margin{
        margin-left: 14px;
    }
    &-function{
        margin-left:6px!important;
    }
    &-text{
        text-align: justify;
        &--margin{
            margin-left: 6px!important;
        }
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        &-key{
            color: #990055;
        }
        &-number{
            color: #0086b3;
        }
        &-string{
            color: #183691;
        }
        &-null{
            color:#666666;
        }
        &-undefined{
            color:#666666;
        }
        &-boolean{
            color: #0086b3;
        }
    }
}
</style>