### 最终效果展示
![img](https://51nbimg.u51.com/3baf675d8f36442a8cc451b13cc07329.gif)

### 解决的痛点：
1. weex在客户端调试的时候没有一个很合适的方法，之前在人品贷开发中总结了4种，各有利弊，都不完美，详细分析见[wiki](http://wiki.51.nb/pages/viewpage.action?pageId=63352230)
2. 虽然可以在web端调试，但是总有一些信息在客户端和web端不一致
3. 为什么不用weex-monitor（输出,console.log会以json.stringify输出，观察一些结构化的数据不方便，遇到循环对象会直接报错）

### 为什么要用wconsole
1. 客户端可以直接使用，console.log会直接打印出来，同时对结构化的对象和循环对象都做了处理，均可以进行展示
2. 客户端web端最不一致的情况就是pg，借助wconsole，可以完美的对object进行展示
3. 支持console.warn,console.error,console.info
4. 支持storage结构化展现、刷新、清除 以及值的复制
5. 支持system（系统信息展示）
6. 支持code编辑以及运行

### 后续计划
1. 捕获js全局的错误并展示
2. 同客户端同学交流，捕获原生的错误并展示
3. element的显示（看看需求是否旺盛）
4. 增加ajax请求的拦截（需求是否旺盛）

### 使用方法
step1. 安装 nbm install --save wconsole

step2. 在entry.js中引入即可(版本>=1.1.0)

```js
import * as service from 'weex-service';
import 'wconsole';//引入

const routes = [];

export default function create(App) {
    return service.create('#app', App, routes);
}
```

**如果weex模版版本>=2.3,则不需要自行配置webpack,直接使用即可，否则，需要进行webpack的配置，[更新日志](http://git.51.nb/html5/fe-template-weex/issues/2)**
step3. 修改webpack.base.js配置，由于wconsole采用源码引入的方式，所以需要对.vue文件和.less文件进行编译(week-ui也采用的是源码编译的方式，所以修改的时候，只要week-ui借助的，wconsole也要借助)
具体操作方法如下：

```
// 找到下述字段：
// 在exclude中添加wconsole路径，
// 在下面这种情况下可以修改为： exclude: /node_modules\/(?!(wee(k|x)-ui|wconsole))/,
test: /\.vue$/,
loader: 'vue-loader',
exclude: /node_modules\/(?!\/week-ui)/,

// 同样，将exclude修改为: exclude: /node_modules\/(?!(?(wee(k|x)-ui|wconsole))/,
test: /\.vue$/,
loader: 'weex-vue-loader',
exclude: /node_modules\/(?!\/week-ui)/,
```

### 常见的可能的问题
1. 报错，说wconsole/view/wconsole.vue，这个文件不支持，需要loader，这里就是因为wconsole采用源码打包的方式，webpakc没有给它设置loader，需要按照上述使用方法中的第3条
2. css样式很奇怪，整个缩小了一圈的感觉。这还是源码打包的锅，因为采用px，所以需要postcss进行px的处理，在webpack.base.js中寻找postcss，或者直接查找week-ui,找到css处理的地方，将wconsole加入进去就可以了

### 可以参考的webpack的模版
本工程compile目录下提供了[webpack.base.js](./compile/webpack.base.js)和[webpack2.base.js](./compile/webpack2.base.js)的模版，最核心的还是js,vue,css的源码需要加loader处理。可能涉及到的loader就是babel,vue-loader,weex-vue-loader,postcss。在两个文件中直接搜索wconsole，看看改了哪里对照修改即可。

### 源码调试方法
对wconsole有兴趣的同学可以参照下面的方式进行本地调试，没有问题的话欢迎issues哈
1. git clone git@git.51.nb:maxiaobo/wconsole.git
2. nbm i
3. nbm run dev
4. wconsole本质上是一个vue组件，并对全局的console进行了重写，核心代码在entry以及src/components/wconsole中

### 版本更新说明
1. 1.1.2- 解决安卓端蒙层遮挡住所有区域的bug，修复安卓按钮看起来有两层的样式问题(使用阴影导致)
2. 1.1.3- 修复clear之后，再次console.log不会显示的bug。同时顺带修复了pop之后前一个页面console日志没有更新的bug
3. 1.1.4- 支持wconsole拖拽，安卓端不会有拖拽动画（只会从起始点移动到终止点），ios端和web端有动画效果
4. 1.1.5- 浏览器端取消console劫持(仅保留样式)，处理console.log(a, b)为console.log(a), console.log(b)，展示效果更加清晰
5. 1.1.6- 增加生产环境判断为：if(process.env.BUILD_ENV !== 'prod'), 参考发布系统[wiki](http://wiki.51.nb/pages/viewpage.action?pageId=62875118)，保证在生产环境看不到的同时，在stable环境还能够使用wconsole
6. 1.1.7- 修复字符串过长不会自动换行的问题，其原因在于外部flex布局，内部没有给string所在的text进行flex:1处理（感谢@徐浩洋）,同时发现了子tab下clear无效的问题，已经修复
7. 1.1.8- 修复子tab下clear在其他页面不更新的问题，修改数组展示方法
8. 1.1.9- 规范代码，增加注释
9. 1.2.0- 新增system、storage
10. 2.0.0- 新增code编辑运行、UI优化

欢迎issues，contribuations @马晓博 感谢@徐浩洋、@周窍在我开发中提供的帮助和意见
