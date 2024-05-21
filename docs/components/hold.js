---
title: Raw temperature data - test
toc: true
---

```js
import {plotTimeSeries, plotAirWater, plotWaterDischarge, plotCurve, plotCurveHover, plotPhaseAmp} from "./components/raw_data_plots.js";
//import {addMap} from "./components/raw_data_map.js";
//import {interval} from 'https://observablehq.com/@mootari/range-slider';
import * as d3 from "npm:d3";
//import {Mutable} from "@observablehq/stdlib";
//import * as tidyjs from "npm:tidyjs";
```

```js
import {dt, dtYDAY, dtYDAY_Week, dtYDAY_Month, dtHOUR, dtHOUR_ampPhase, dtHOUR_params_pred} from "./components/variables.js";

import {VA_data} from "./components/variables.js";
```

The dataset for exploration here is from Shenandoah National Park.  
During development of this application, the dataset is limited to just two sites for uploading speed.

## Raw data summary

<div class="grid grid-cols-4">
  <div class="card">
    <h2>Total number of observations</h2>
    <span class="big">${dt.length.toLocaleString("en-US")}</span>
  </div>
  <div class="card">
    <h2>Number of water temp observations</h2>
    <span class="big">${dt.filter(d => d.waterTemperature).length.toLocaleString("en-US")}</span>
  </div>
  <div class="card">
    <h2>Number of air temp observations</h2>
    <span class="big">${dt.filter(d => d.airTemperature).length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>Number of air temp observations (F)</h2>
    <span class="big">${dt.filter(d => d.AirTemperature_HOBO_degF).length.toLocaleString("en-US")}</span>
  </div>
</div>

---

```js
display(VA_data)
```

All sites are on the map, but only the "**PA**" sites are included in the data for now.

<div class="grid grid-cols-1">
  <div class="card">
    ${div_map1}
  </div>
</div>

```js
// Map1
  const lat1 = 38.5;
  const lon1 = -78.5;
  const mag1 = 9.2;

  const div_map1 = display(document.createElement("div"));
  div_map1.style = "height: 500px;";

  const map1 = L.map(div_map1)
    .setView([lat1, lon1], mag1);

  L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',   
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
  )
  .addTo(map1);

  const basemaps1 = {
    USGS_hydro: L.tileLayer(
      'https://basemap.nationalmap.gov/arcgis/rest/services/USGSHydroCached/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '<a href="http://www.doi.gov">U.S. Department of the Interior</a> | <a href="http://www.usgs.gov">U.S. Geological Survey</a> | <a href="http://www.usgs.gov/laws/policies_notices.html">Policies</a>',
        maxZoom: 20
      }
    ),
    StreetView: L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',   
      {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
    ),
    Topography: L.tileLayer.wms(
      'http://ows.mundialis.de/services/service?',   
      {layers: 'TOPO-WMS'}
    ),
    Places: L.tileLayer.wms(
      'http://ows.mundialis.de/services/service?', 
      {layers: 'OSM-Overlay-WMS'}
    ),
    USGS_USImagery: L.tileLayer(
      'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 20,
        attribution:
        'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
      }
    )
  };
  L.control.layers(basemaps1).addTo(map1);
  basemaps1.USGS_hydro.addTo(map1);

  // Store the initial map view
  const initialView1 = map1.getBounds();

  // Update the map view when the window is resized
  window.addEventListener('resize', function() {
    map1.fitBounds(initialView1);
  });
```

```js
function addMarkers(dIn) {
  let markers = [];
  dIn.forEach(function(d) {
    let marker = L.circleMarker([d.Latitude_dec_deg, d.Longitude_dec_deg], {
      color: 'blue',
      fillColor: '#30f',
      fillOpacity: 0.5,
      radius: 10
    }).addTo(map1);

    // Add a 'selected' property to the marker
    marker.selected = false;
    marker.siteID = d.Site_ID;

    markers.push(marker);
  });
  return markers;
}

function addClickListenersToMarkers(markers) {
  markers.forEach(function(marker) {
    // Add a click event listener to the marker
    marker.on('click', function() {
      // Toggle the 'selected' property
      this.selected = !this.selected;

      markersSelected.value = markers.filter(d => d.selected).map(d => d.siteID)
      // Update the marker styles
      updateMarkerStyles(markers);
    });
  });
}

function updateMarkerStyles(markers) {
  markers.forEach(function(marker) {
    if (marker.selected) {
      marker.setStyle({
        color: '#eb8117',
        fillColor: '#f03',
      });
    } else {
      marker.setStyle({
        color: 'blue',
        fillColor: '#30f',
      });
    }
  });
  console.log("updateMarkerStyle", markers.filter(d => d.selected).map(d => d.siteID))
}

let markers = addMarkers(VA_data);
addClickListenersToMarkers(markers);
let markersSelected = Mutable([]);
```

```js
selectSites.addEventListener('change', function() {
  let selectedSite = this.value;
  console.log("selectSites event", selectedSite)

  markers.forEach(function(marker) {
    if (selectedSite.includes(marker.siteID)) {
      marker.selected = true;
    } else {
      marker.selected = false;
    }
  });

  markersSelected.value = markers.filter(d => d.selected).map(d => d.siteID);
  updateMarkerStyles(markers);
});
```

---

<div class="grid grid-cols-4">
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${selectSites}
  </div>
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${selectYears}
  </div>
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${selectSeasons}
  </div>
</div>

*color-code map dots by metrics(?). Will metrics need to be standardized across broad region?*   
*add crossfilter for temp raw data and link with map*

```js
//import { getInputs } from "/components/inputs.js";//,

const sites = [...new Set(dt.map(d => d.siteID))].sort();
const selectSites = Inputs.select(sites, {
  //value: sites,
  value: markersSelected, 
  multiple: 8, width: 100, label: "Select sites"});
const selectedSites = Generators.input(selectSites);

const years = [...new Set(dt.map(d => d.year))].sort();
const selectYears = (Inputs.select(years, {value: years, multiple: true, width: 80, label: "Select years"}));
const selectedYears = Generators.input(selectYears);

const seasons = ["Spring", "Summer", "Autumn", "Winter"];//[...new Set(dt.map(d => d.season))];
const selectSeasons = (Inputs.select(seasons, {value: seasons, multiple: true, width: 80, label: "Select seasons"}));
const selectedSeasons = Generators.input(selectSeasons);

const ydays = [...new Set(dt.map(d => d.yday))].sort((function(a, b) {
  return a - b;
}));
const selectYdays = (Inputs.select(ydays, {value: d3.range(1,366,60), multiple: true, width: 80, label: "Select day(s) of year"}));
const selectedYdays = Generators.input(selectYdays);

const groupSiteID = [...new Set(dt.map(d => d.siteID))].sort() // for the colorScale

const showAir = (Inputs.radio([true, false], {label: "Show Air Temp?", value: true}));
const selectedShowAir = Generators.input(showAir);

const showWater = (Inputs.radio([true, false], {label: "Show Water Temp?", value: true}));
const selectedShowWater = Generators.input(showWater);

const showAWLines = (Inputs.radio([true, false], {label: "Show lines?", value: true}));
const selectedShowAWLines = Generators.input(showAWLines);

const facetDaily = (Inputs.radio([true, false], {label: "Graph by day? [not yet implemented]", value: true}));
const selectedFacetDaily = Generators.input(facetDaily);

const facetYearly = (Inputs.radio([true, false], {label: "Facet by year?", value: false}));
const selectedFacetYearly = Generators.input(facetYearly);

const aggregators = ["Monthly", "Weekly", "Daily", "15 Minute"];
const selectAggregators = (Inputs.select(aggregators, {value: "Daily", multiple: false, width: 90, label: "Select aggregation level"}));
const selectedAggregators = Generators.input(selectAggregators);

const selectPValue = (Inputs.range([0.0001, 1], {value: 1, step: 0.01, width: 220, label: "Select minimum p-value of max(ABC)"}));
const selectedPValue = Generators.input(selectPValue);

const selectRSAir = (Inputs.range([0.01, 0.99], {value: 0.01, step: 0.01, width: 200, label: "Select minimum r-squared for air data fits"}));
const selectedRSAir = Generators.input(selectRSAir);

const selectRSWater = (Inputs.range([0.01, 0.99], {value: 0.01, step: 0.01, width: 200, label: "Select minimum r-squared for water data fits"}));
const selectedRSWater = Generators.input(selectRSWater);

```

```js
import { filterBySiteID_year, filterBySiteID_year_season, filterBySiteID_year_yday } from "/components/variables.js";

const dtFiltered = filterBySiteID_year_season(dt, selectedSites, selectedYears, selectedSeasons)
const dtYDAYFiltered = filterBySiteID_year_season(dtYDAY, selectedSites, selectedYears, selectedSeasons)
const dtYDAY_Week_Filtered = filterBySiteID_year_season(dtYDAY_Week, selectedSites, selectedYears, selectedSeasons)
const dtYDAY_Month_Filtered = filterBySiteID_year_season(dtYDAY_Month, selectedSites, selectedYears, selectedSeasons)

const dtHOURFiltered = filterBySiteID_year_yday(dtHOUR, selectedSites, selectedYears, selectedYdays)

const dtHOUR_ampPhase_Filtered = filterBySiteID_year_season(dtHOUR_ampPhase, selectedSites, selectedYears, selectedSeasons).filter(
  d => d.pMaxMax < selectedPValue &&
  d.rSquared_air > selectedRSAir &&
  d.rSquared_water > selectedRSWater 
)
```

---

Filtered object:

```js
display(dtFiltered)
```

---

## Plot air/water temperature

<div class="grid grid-cols-4"> 
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${selectAggregators}
  </div>
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${showAWLines}
  </div>
</div>

```js
import { getAggregatedData } from "/components/variables.js";
const aggregatedData = getAggregatedData(selectedAggregators, dtFiltered, dtYDAYFiltered, dtYDAY_Week_Filtered, dtYDAY_Month_Filtered)
```

```js
plotAirWater(aggregatedData, selectedShowAWLines)
```

---

## Plot time series

<div class="grid grid-cols-2"> 
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${showWater}
    ${showAir}
    ${facetYearly}
  </div>
</div>

Mouse over the time series chart below to see the hourly chart for the selected site, year, and day of year. Water temperature is in blue and air temperature is grey. Predictions are the smooth lines.

```js
const timeSeriesHover = view(plotTimeSeries(dtFiltered, groupSiteID, selectedShowWater, selectedShowAir, selectedFacetYearly));
```

```js
/*
//let clickedData = [];
let selection = d3.selectAll(timeSeriesHover).selectAll('.line') 
  .on('click', function(event, d) {
    // 'd' is the data bound to the clicked element
    console.log(d);  // Log the data to the console
  });
*/
```

```js
display(timeSeriesHover)
```

```js
plotCurveHover(dtHOUR, dtHOUR_params_pred, timeSeriesHover)
```

*add capability to add days to the graph by clicking*

---

## Plot phase difference and amplitude ratio

Filter the graphs for curve fit statistics. Default filter values are set to show all data.  
Use the ABC filter in the first column to filter based on the larger p-value of the 3 ABC paramters for both the *air* and *water* temperature models in the sin-cos curve fit for each day. *Will probably lose this as r-square may make more sense as a filter*  
Use the r-square filters in the second column to filter based on r-square values for either the *air* or *water* temperature models.

<div class="grid grid-cols-3">
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${selectPValue}
  </div>
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${selectRSAir}
    ${selectRSWater}
  </div>
</div>

```js
plotPhaseAmp(dtHOUR_ampPhase_Filtered)
```

```js
display(dtHOUR_ampPhase_Filtered)
```

---

Table of filtered data  
*Here for now*

```js
Inputs.table(dtFiltered)
```

---

## Plot hourly data

This is likely redundant with the time series clickable graph above.  
*Leaving in for now.*

<div class="grid grid-cols-4"> 
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${view(selectYdays)}
  </div>
</div>

```js
display(dtHOURFiltered)
```

```js
plotCurve(dtHOURFiltered)
```
