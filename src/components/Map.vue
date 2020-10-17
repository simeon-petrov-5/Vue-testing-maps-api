<template>
  <section class="mapWrapper">
    <GmapMap
      map-type-id="terrain"
      :center="centerPosition"
      :zoom="3"
      style="width: 100%; height: 500px"
    >
      <gmap-info-window
        :options="infoOptions"
        :position="infoWindowPos"
        :opened="infoWinOpen"
        @closeclick="infoWinOpen = false"
      >
      </gmap-info-window>
      <GmapCluster>
        <GmapMarker
          :key="index"
          v-for="(place, index) in allPlaces"
          :position="place.position"
          :clickable="true"
          @click="toggleInfoWindow(place, index)"
        />
      </GmapCluster>
    </GmapMap>
  </section>
</template>

<script>
export default {
  props: {
    allPlaces: Array,
  },
  data: () => ({
    centerPosition: {
      lat: 0.0,
      lng: 0.0,
    },
    // Info window
    infoWindowPos: null,
    infoWinOpen: false,
    currentMidx: null,
    infoOptions: {
      content: "",
      pixelOffset: {
        width: 0,
        height: -35,
      },
    },
  }),
  methods: {
    toggleInfoWindow: function (marker, idx) {
      this.infoWindowPos = marker.position;
      this.infoOptions.content = marker.infoText;

      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      } else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },
  },
};
</script>

<style>
.mapWrapper {
  width: 49%;
}
</style>