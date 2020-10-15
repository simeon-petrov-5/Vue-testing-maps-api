<template>
  <div id="app">
    <section class="placesWrapper">
      <label>
        Select your address
      </label>
      <gmap-autocomplete
        value=""
        class="autocompleter"
        placeholder="This is a placeholder text"
        @place_changed="setPlace"
        :select-first-on-enter="true"
      >
      </gmap-autocomplete>
      <div v-if="!!places.length">
        <h2>Address data from maps</h2>
        <ul class="placesList">
          <li
            class="place"
            v-for="(place, index) in places"
            :key="'place-' + index"
          >
            <ul>
              <template v-for="(value, key) of place">
                <li
                  v-if="key !== 'infoText'"
                  class="placeAddrs"
                  :key="key + index"
                >
                  <span class="key">{{ key }}</span> : {{ value }}
                </li>
              </template>
            </ul>
          </li>
        </ul>
      </div>
    </section>

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
            v-for="(place, index) in places"
            :position="place.position"
            :clickable="true"
            @click="toggleInfoWindow(place, index)"
          />
        </GmapCluster>
      </GmapMap>
    </section>
  </div>
</template>

<script>
import addressFields from "./constants/addressFields";
import continentsObject from "./constants/continentsObject";

export default {
  name: "App",
  data: () => ({
    places: [],
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
      //optional: offset infowindow so it visually sits nicely on top of our marker
      pixelOffset: {
        width: 0,
        height: -35,
      },
    },
  }),
  methods: {
    getPlaceData(placeData) {
      let place = {
        position: {
          lat: placeData.geometry.location.lat(),
          lng: placeData.geometry.location.lng(),
        },
      };
      placeData.address_components.forEach((comp) => {
        const type = comp.types[0];
        if (addressFields.includes(type)) {
          place[type] = comp.long_name;
          if (type === "country") {
            place.continent = continentsObject[comp.short_name];
          }
        }
      });
      place.infoText = `<strong>Marker ${place.country}</strong><br/><p>some different text</p>`;
      return place;
    },
    setMapCenter(center) {
      console.log(this.centerPosition, center);
      this.centerPosition = center;
    },
    setPlace(place) {
      if (!place) return;
      console.log("address_components", place.address_components);
      console.log("place", place);

      const placeData = this.getPlaceData(place);
      this.places.push(placeData);
    },
    toggleInfoWindow: function(marker, idx) {
      this.infoWindowPos = marker.position;
      this.infoOptions.content = marker.infoText;

      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
#app {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
}

.placesWrapper,
.mapWrapper {
  width: 49%;
}

.autocompleter {
  display: block;
  width: 300px;
}

/* .placesList {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
} */

.place {
  border: 1px solid lightgray;
  background: white;
  border-radius: 15px;
  padding: 10px;
  margin-bottom: 15px;
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12);
}

.key {
  font-weight: bold;
}
</style>
