import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
/*變量名from安裝檔名稱......此名稱同npm指令名稱*/
import axios from 'axios';
import qs from 'qs';

Vue.use(ElementUI);
/*Vue.prototype.自定義=變量名，其中變量名只需與上述一致即可；自定義則全局使用*/
Vue.prototype.qs = qs;
Vue.prototype.axios = axios;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
