---
title: Raw flow and temperature data
toc: true
---

```js
import {plotWaterDischarge} from "./components/raw_data_flow_temp_plots.js";
import * as d3 from "npm:d3";
//import * as tidyjs from "npm:tidyjs";
```

```js
import {dt, dtYDAY, dtYDAY_Week, dtYDAY_Month, dtHOUR} from "./components/variables.js";
```

```js
const aggregators = ["Monthly", "Weekly", "Daily", "15 Minute"];
const selectAggregators = (Inputs.select(aggregators, {value: "Daily", multiple: false, width: 90, label: "Select aggregation level"}));
const selectedAggregators = Generators.input(selectAggregators);
```

## Plot water temperature/discharge
This will be developed futher as needed.

```js
const sites = [...new Set(dt.map(d => d.siteID))].sort();
const selectSites = (Inputs.select(sites, {value: sites, multiple: 8, width: 100, label: "Select sites"}));
const selectedSites = Generators.input(selectSites);

const years = [...new Set(dt.map(d => d.year))].sort();
const selectYears = (Inputs.select(years, {value: years, multiple: true, width: 80, label: "Select years"}));
const selectedYears = Generators.input(selectYears);

const seasons = ["Spring", "Summer", "Autumn", "Winter"];
const selectSeasons = (Inputs.select(seasons, {value: seasons, multiple: true, width: 80, label: "Select seasons"}));
const selectedSeasons = Generators.input(selectSeasons);


const ydays = [...new Set(dt.map(d => d.yday))].sort((function(a, b) {
  return a - b;
}));
const selectYdays = (Inputs.select(ydays, {value: d3.range(1,366,60), multiple: true, width: 80, label: "Select day(s) of year"}));
const selectedYdays = Generators.input(selectYdays);
```

---

<div class="grid grid-cols-4">
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${view(selectSites)}
  </div>
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${view(selectYears)}
  </div>
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${selectSeasons}
  </div>
</div>

```js
display(aggregatedData)
```

---

```js
import { filterBySiteID_year, filterBySiteID_year_season, filterBySiteID_year_yday } from "/components/variables.js";

const dtFiltered = filterBySiteID_year_season(dt, selectedSites, selectedYears, selectedSeasons)
const dtYDAYFiltered = filterBySiteID_year_season(dtYDAY, selectedSites, selectedYears, selectedSeasons)
const dtYDAY_Week_Filtered = filterBySiteID_year_season(dtYDAY_Week, selectedSites, selectedYears, selectedSeasons)
const dtYDAY_Month_Filtered = filterBySiteID_year_season(dtYDAY_Month, selectedSites, selectedYears, selectedSeasons)
```

<div class="grid grid-cols-2"> 
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${selectAggregators}
  </div>
</div>

```js
import { getAggregatedData } from "/components/variables.js";
const aggregatedData = getAggregatedData(selectedAggregators, dtFiltered, dtYDAYFiltered, dtYDAY_Week_Filtered, dtYDAY_Month_Filtered)
```

```js
plotWaterDischarge(aggregatedData)
```

*Could add images as pop-up*  
*for hysterisis, divide temperature by flow, as in https://doi.org/10.1016/j.scitotenv.2015.11.028. Add option button*  
