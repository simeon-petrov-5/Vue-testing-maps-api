<template>
  <section class="placesWrapper">
    <label> Select your address </label>
    <gmap-autocomplete
      class="autocompleter"
      placeholder="Enter your address"
      @place_changed="setPlace"
      :select-first-on-enter="true"
    >
    </gmap-autocomplete>
    <div v-if="!!allPlaces.length">
      <h2>Address data from maps</h2>
      <ul class="placesList">
        <li
          class="place"
          v-for="(place, index) in allPlaces"
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
</template>

<script>
import addressFields from "../constants/addressFields";
import continentsObject from "../constants/continentsObject";
import { gmapApi } from "vue2-google-maps";

export default {
  props: {
    allPlaces: Array,
  },
  data: () => ({
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
  computed: {
    google: gmapApi,
  },
  methods: {
    async getPlaceData(placeData) {
      const place = {
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
      if (place.natural_feature && !place.country) {
        const { country, continent } = await this.getReverseGeocode(
          place.position
        );
        place.country = country;
        place.continent = continent;
      }
      place.infoText = `<strong>Marker ${place.country}</strong><br/><p>some different text</p>`;
      return place;
    },
    async setPlace(place) {
      if (!place) return;
      const placeData = await this.getPlaceData(place);
      this.$emit("add-place", placeData);
    },
    async getReverseGeocode(latlng) {
      const geocoder = new this.google.maps.Geocoder();
      let natFeatureLocation = {};

      return new Promise(function (resolve, reject) {
        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === "OK") {
            if (results[0]) {
              const { address_components } = results[0];
              address_components.forEach((component) => {
                if (component.types[0] === "country") {
                  natFeatureLocation = {
                    country: component.long_name,
                    continent: continentsObject[component.short_name],
                  };
                }
              });
              resolve(natFeatureLocation);
            }
          }
          reject("Can not get geocode data.");
        });
      });
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

.placesWrapper {
  width: 49%;
}

.autocompleter {
  display: block;
  width: 300px;
}

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