
```js
import {plotWaterDischarge} from "./components/temperatureFlowDataPlots.js";
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

    table(dt0$Site_ID, is.na(dt0$Discharge_Hobo_cfs))
           FALSE   TRUE
    PA_01FL  77260   2761  
    PA_02FL  67466    746  
    PA_03FL      0  80016  
    PA_04FL      0  80014  
    PA_05FL      0  79975  
    PA_06FL  51432  17212  
    PA_07FL  68017   1873  
    PA_08FL  29769   1867  
    PA_09FL      0  79969  
    PA_10FL      0  79967  
    PI_01FL      0  80166  
    PI_02FL      0  73040  
    PI_03FL      0  80163  
    PI_04FL      0  62733  
    PI_05FL      0  69527  
    PI_06FL      0 110941  
    PI_08FL      0  79399  
    PI_09FL      0  69430  
    PI_10FL      0  80061  
    SR_01FL      0  80119  
    SR_02FL  68660    600  
    SR_03FL  68660  10683  
    SR_04FL      0  80112  
    SR_05FL      0  69725  
    SR_06FL  56437  13132  
    SR_07FL  56588  13127  
    SR_08FL      0  69727  
    SR_09FL  56580  13128  
    SR_10FL      0  69726
  
    table(dt0$Site_ID, is.na(dt0$AirTemperature_HOBO_degF))        
             FALSE   TRUE  
    PA_01FL  80019      2
    PA_02FL      0  68212
    PA_03FL      0  80016
    PA_04FL      0  80014
    PA_05FL  79975      0
    PA_06FL      0  68644
    PA_07FL      0  69890
    PA_08FL      0  31636
    PA_09FL      0  79969
    PA_10FL  79967      0
    PI_01FL  80166      0
    PI_02FL      0  73040
    PI_03FL      0  80163
    PI_04FL      0  62733
    PI_05FL  69527      0
    PI_06FL      0 110941
    PI_08FL      0  79399
    PI_09FL      0  69430
    PI_10FL  80061      0
    SR_01FL  80119      0
    SR_02FL      0  69260
    SR_03FL      0  79343
    SR_04FL  79344    768
    SR_05FL      0  69725
    SR_06FL      0  69569
    SR_07FL      0  69715
    SR_08FL      0  69727
    SR_09FL      0  69708
    SR_10FL  69726      0



*Could add images as pop-up*  
*for hysterisis, divide temperature by flow, as in https://doi.org/10.1016/j.scitotenv.2015.11.028. Add option button*  
