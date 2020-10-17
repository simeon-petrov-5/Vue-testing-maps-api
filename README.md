# vue-maps-demo
Simple project (Proof of Concept) to test and see what kind of options we have from the Google Maps API and how it actually works.

## Project
The project is build upon Vue 2.6 (Vue CLI - [Creating a Project](https://cli.vuejs.org/guide/creating-a-project.html) ) and has [vue2-google-maps](https://github.com/xkjyeah/vue-google-maps) as main dependency.

### Google Maps API key 
[Generating an Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key).  
After you generate your API key you have to enable: 
- **Maps JavaScript API** - for the actual map in the app
- **Places API** & **Geocoding API** - for searching address and getting additional data (e.g. country) when missing
To add and use your API key you have to create a `.env` file with `VUE_APP_MAPS_API` field for the key.

## Setup
```
yarn install
```
### Compiles and hot-reloads for development
```
yarn dev
```
### Compiles and minifies for production
```
yarn build
```
### Lints and fixes files
```
yarn lint
```
