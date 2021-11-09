const m3 = require("@wecise/m3js");
import Vue from 'vue'
import App from './App.vue'

// const themeColor = {dark:'#252D47',light:'#409EFF'};
const theme = '#252D47';// dark:#252D47 & blue:#409EFF  default theme is dark
import(`./assets/theme/element-${theme}/index.css`)
import moment from 'moment'
import animate from 'animate.css'
import VueSplit from 'vue-split-panel'
import './js/dialog'
import './icons'

Vue.use(VueSplit);
Vue.use(animate);

Vue.prototype.moment = moment;
Vue.prototype.moment.locale(window.M3_LANG);
Vue.prototype.eventHub = new Vue();

Vue.config.productionTip = false;

window.moment = moment;
window.M3_LANG = 'zh-CN';
  
m3.init().then(()=>{
    new Vue({
        render: h => h(App)
    }).$mount('#app')
}).catch((e)=>{
    console.error(e)
})
