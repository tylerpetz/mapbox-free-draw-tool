import Vue from 'vue';
import Mapbox from 'mapbox-gl';
import {
  MglMap,
  MglMarker,
  MglPopup,
  MglNavigationControl,
  MglGeolocateControl,
  MglGeojsonLayer,
} from 'vue-mapbox';
import App from './App.vue';
import router from './router';
import store from './store';

// import css for mapbox and plugins
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

require('mapbox-gl-draw-freehand-mode');

// import mapbox compoents
Vue.use(Mapbox);
Vue.component('MglMap', MglMap);
Vue.component('MglMarker', MglMarker);
Vue.component('MglPopup', MglPopup);
Vue.component('MglNavigationControl', MglNavigationControl);
Vue.component('MglGeolocateControl', MglGeolocateControl);
Vue.component('MglGeojsonLayer', MglGeojsonLayer);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
