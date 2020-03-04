### vconsole weex适配

#### 过程
1. 发现dom不存在
2. dom是在mounted之后存在
3. dom不支持获取节点
4. dom.createElement这样的操作可以获取节点，同时节点具有setAttrs以及setStyles这样的更改节点属性的方法。可以实现view层的修改

#### 问题记录
1. box-shadow在安卓上不能覆盖padding

##### 采用weex原生document提供的方法还是使用vue组件的形式对vconsole进行重写？（已经解决，采用组件）
1. 原生操作起来相对麻烦，无缝接入
2. 组件代码写起来更快，但是无缝接入的时候可能有点麻烦
在此处选择组件的方案

##### console.log需要全局覆盖怎么操作?(已解决，采用vendor引入，从而全局覆盖)
经过测试，全局覆盖，需要在vendor中定义全局变量，才能达到全局的效果。不然就需要挂载到Vue或者Weex下，每次使用就需要weex.console.log，相对麻烦一点。用户有痛感。
如果要console.log，那么需要在Vendor中引入，从而生成一个自己的全局变量console，从而实现信息的拦截，用户可以无感接入

##### console.log的数据如何响应式的反应到view层上？（已解决）
每次console.log的数据，需要存放到一个全局obj，$wstore中，将这个obj和view层进行动态绑定

##### 如何能够做到无缝接入？（采用方案2，mixin）
1. webpack的loader中，检测template，匹配到</template>之后直接替换，从而插入组件
2. mixin，在mounted之后，采用浩阳介绍的[方法](http://git.51.nb/xuhaoyang/weex-experience/blob/master/src/views/mount/index.vue)类似的方式将组件插入

#### 开发计划
1. log view组件的编写（2天代码编写+半天代码优化）
2. log 逻辑层的改写及测试（到这一步就可以看到效果）（3天代码编写）
3. mixin接入（半天）
4. element,network,storage的接入（视情况和需求决定，目前排序：storage>element>network，因为network可以通过charles看到） 

总共大概一周半左右的开发时间，基本上就够了（也有可能过于自信了，实际可能会出的问题）

#### 最终开发周期
wconsole的所有功能就开发完毕了，大概耗时：11.5（view层处理）+4（重写console）+1（全局混入）=16.5小时，比预期快一点，其实本质最难的还是view层的处理，因为循环对象的展示需要用到递归组件，写起来稍微麻烦一点。

#### 可拖拽的实现
1. 监听panmove,panstart,panend事件，web端监听touch事件
2. web端touch会触发后面背景的滚动，从而不能拖拽，通过添加css touch-action: none;来实现对默认行为的禁止
3. native端不能设置静态样式，需要动态对样式进行设置，否则将会在设置结束后被静态样式覆盖
4. 动态设置过程中，安卓端总会回归上一次的动态样式，不是很理解，暂时放弃这里的动画
5. 新的解决思路是bingX，但是需要客户端支持
