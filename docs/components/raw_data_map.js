
```js
let markers = [];
let selectedSitesMap = Mutable([]);

function addAndSelectMarkers(dIn) {
  let selectedSiteIDsHere = [];

  dIn.forEach(function(d) {
    let marker = L.circleMarker([d.Latitude_dec_deg, d.Longitude_dec_deg], {
      color: 'blue',
      fillColor: '#30f',
      fillOpacity: 0.5,
      radius: 10
    }).addTo(map1);

    // Associate the siteID with the marker
    marker.siteID = d.Site_ID;

    marker.on('click', function() {
      if (!selectedSiteIDsHere.includes(this.siteID)) {
        selectedSiteIDsHere.push(this.siteID);
      } else {
        selectedSiteIDsHere = selectedSiteIDsHere.filter(id => id !== this.siteID);
      }
      console.log('Selected siteIDs:', selectedSiteIDsHere);

      selectedSitesMap.value = selectedSiteIDsHere;
    });

    markers.push(marker);
  });

  //console.log(markers)

  markers.forEach(function(marker) {
    if (selectedSitesMap.value.includes(marker.siteID)) {
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
  })
}

addAndSelectMarkers(VA_data)
```

```js
display(selectedSitesMap)
display(selectedSites)

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

*Add map (could color-code map dots by metrics). Will metrics need to be standardized across broad region?*   
*add crossfilter for temp raw data and link with map*

```js
import { getInputs } from "/components/inputs.js";//,
 //selectYears, selectedYears, selectYdays, selectedYdays, groupSiteID, showAir, selectedShowAir, showWater, selectedShowWater, facetDaily, selectedFacetDaily, facetYearly,selectedFacetYearly, selectAggregators, selectedAggregators 
 //} ;

const sites = [...new Set(dt.map(d => d.siteID))].sort();
const selectSites = (Inputs.select(sites, {value: selectedSitesMap, multiple: 8, width: 100, label: "Select sites"}));
const selectedSites = Generators.input(selectSites);



const sites = [...new Set(dt.map(d => d.siteID))].sort();
const selectSites = (Inputs.select(sites, {value: selectedSitesMap, multiple: 8, width: 100, label: "Select sites"}));
const selectedSites = Generators.input(selectSites);
