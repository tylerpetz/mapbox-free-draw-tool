<script>
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { listings } from '../assets/listings.json';
import { placeGeo } from '../assets/placeGeo.json';
/* eslint-disable */
const mapDraw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    polygon: true,
  },
  modes: Object.assign({
    draw_free: require('mapbox-gl-draw-freehand-mode'),
  }, MapboxDraw.modes),
});
/* eslint-enable */

export default {
  name: 'Home',
  data() {
    return {
      token: 'pk.eyJ1IjoiYW50aG9ueWJvb2oiLCJhIjoiY2syYW5qdzN5MTh5ZjNjbzJybzE3YmtibCJ9.vqfOJE75lgAESfQQvbuN1Q',
      mapStyle: 'mapbox://styles/mapbox/streets-v11',
      drawing: false,
      placeGeometry: placeGeo,
    };
  },
  computed: {
    bounds() {
      return {
        maxLat: 39.81375811849629,
        maxLon: -104.93527225334942,
        minLat: 39.78612827103066,
        minLon: -105.03904155571759,
      };
    },
    coordinates() {
      return {
        lat: 39.742043,
        lon: -104.991531,
      };
    },
    listings() {
      return listings;
    },
    geoJsonLayer() {
      return {
        type: 'line',
        paint: {
          'line-color': '#000',
          'line-opacity': 0.75,
        },
      };
    },
    geoJsonSource() {
      if (
        Object.entries(this.placeGeometry).length > 0
        && typeof this.placeGeometry.geometries === 'undefined'
      ) {
        return this.geoToPolygon(this.placeGeometry);
      }
      if (
        Object.entries(this.placeGeometry).length > 0
        && typeof this.placeGeometry.geometries !== 'undefined'
      ) {
        return this.geoCollectionToPolygon(this.placeGeometry);
      }
      return false;
    },
  },
  methods: {
    onMapLoaded(event) {
      event.map.addControl(mapDraw);
      event.map.on('draw.create', ({ features }) => {
        if (features) {
          // eslint-disable-next-line
          this.placeGeometry = features[0];
        }
      });
    },
    geoToPolygon(geometryObject) {
      if (geometryObject.coordinates.length > 0) {
        const geojson = {
          type: 'geojson',
          data: {
            id: 'placeGeo',
            type: 'Feature',
            geometry: { ...geometryObject },
          },
        };
        return geojson;
      }
      return false;
    },
    geoCollectionToPolygon(geometryCollection) {
      if (geometryCollection.geometries.length > 0) {
        const features = [];
        geometryCollection.geometries.forEach((geoCollection) => {
          features.push(
            {
              type: 'Feature',
              geometry: { ...geoCollection },
            },
          );
        });
        const geojson = {
          type: 'geojson',
          data: {
            id: 'placeGeo',
            type: 'FeatureCollection',
            features,
          },
        };
        return geojson;
      }
      return false;
    },
  },
};
</script>

<template>
  <div class="home">
    <MglMap
      ref="mapObj"
      :access-token="token"
      :map-style.sync="mapStyle"
      :bounds="bounds"
      :center="coordinates"
      :zoom="10"
      :show-zoom="true"
      :pitch="25"
      @load="onMapLoaded"
    >
      <MglGeolocateControl position="bottom-right" />
      <MglNavigationControl position="bottom-right" />

      <!-- <template v-if="geoJsonSource">
        <MglGeojsonLayer
          :source-id="geoJsonSource.data.id"
          :source="geoJsonSource"
          layer-id="placeGeo"
          :layer="geoJsonLayer"
        />
      </template> -->

      <transition-group name="fade">
        <MglMarker
          v-for="(listing, index) in listings"
          :key="listing.uPI + index"
          :coordinates="[listing.location.lon, listing.location.lat]"
          class="bg-none"
        />
      </transition-group>
    </MglMap>
  </div>
</template>

<style scoped>
.home {
  padding: 1rem;
}

.home > div {
  height: 100vh;
}

.fixed-button {
  position: fixed;
  z-index: 99999;
  bottom: 3rem;
  left: 1rem;
  font-size: 1.5rem;
}
</style>
