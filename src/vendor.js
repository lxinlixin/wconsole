import 'es6-promise/auto';
import Vue from 'vue';
import Weex from 'weex-vue-render';

window.Vue = Vue;
window.weex = Weex;

Weex.init(Vue);
