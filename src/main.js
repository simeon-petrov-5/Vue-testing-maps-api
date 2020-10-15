import Vue from 'vue'
import App from './App.vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import GmapCluster from "vue2-google-maps/dist/components/cluster";

Vue.component('GmapCluster', GmapCluster);
Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_MAPS_API,
    libraries: 'places'
  },
  installComponents: true
})

new Vue({
  render: h => h(App),
}).$mount('#app')
