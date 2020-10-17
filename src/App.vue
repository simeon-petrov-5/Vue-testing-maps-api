<template>
  <div id="app">
    <MapPlaceSearch :allPlaces="places" @add-place="addPlace" />
    <Map :allPlaces="places" />
  </div>
</template>

<script>
import MapPlaceSearch from "./components/MapPlaceSearch";
import Map from "./components/Map";
export default {
  components: {
    MapPlaceSearch,
    Map,
  },
  data: () => ({
    places: [],
  }),
  methods: {
    addPlace(placeData) {
      this.places.push(placeData);
    },
  },
};
</script>

<style>
#app {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
}
</style>
