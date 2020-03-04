import 'es6-promise/auto';
import Vue from 'vue';
import Weex from '@u51/weex-vue-polyfill';

window.Vue = Vue;
window.weex = Weex;

Weex.init(Vue);
