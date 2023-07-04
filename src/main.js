import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import zh_tw_Lang from 'element-ui/lib/locale/lang/zh-TW'; // 引入自己的

import 'element-ui/lib/theme-chalk/index.css';
/*變量名from安裝檔名稱......此名稱同npm指令名稱*/
import axios from 'axios';
import qs from 'qs';

// 發請求時默認會攜帶憑證相關消息以供服務器識別
axios.defaults.withCredentials = true;

Vue.use(ElementUI, {
    locale: { ...zh_tw_Lang }, // 使用本地的 zh_tw_Lang 去覆蓋官方的 zh_cn_Lang
});
/*Vue.prototype.自定義=變量名，其中變量名只需與上述一致即可；自定義則全局使用*/
Vue.prototype.qs = qs;
Vue.prototype.axios = axios;
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
