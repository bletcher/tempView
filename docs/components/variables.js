import {FileAttachment} from "npm:@observablehq/stdlib";
//import {DuckDBClient} from "npm:@observablehq/duckdb";
//import * as d3 from "npm:d3";

export const dt = await FileAttachment("../data/dt.csv").csv({typed: true});
export const dtYDAY = await FileAttachment("../data/dtYDAY.csv").csv({typed: true});
export const dtYDAY_Week = await FileAttachment("../data/dtYDAY_Week.csv").csv({typed: true});
export const dtYDAY_Month = await FileAttachment("../data/dtYDAY_Month.csv").csv({typed: true});
export const dtHOUR = await FileAttachment("../data/dtHOUR.csv").csv({typed: true});
export const dtHOUR_ampPhase = await FileAttachment("../data/dtHOUR_ampPhase.csv").csv({typed: true});
export const dtHOUR_params_pred = await FileAttachment("../data/dtHOUR_params_pred.csv").csv({typed: true});

export const VA_data = await FileAttachment("../data/VA_site_info_DL.csv").csv({typed: true});

export const samples = FileAttachment("../data/samples.parquet").parquet();
//export const dtPQ = FileAttachment("../data/dtPQ.parquet").parquet();

export function filterBySiteID_year_season(d, selectedSites, selectedYears, selectedSeasons) {
  return d.filter(d => 
    selectedSites.includes(d.siteID) && 
    selectedYears.includes(d.year) && 
    selectedSeasons.includes(d.season)
  );
} 

export function filterBySiteID_year_yday(d, selectedSites, selectedYears, selectedYdays) {
  return d.filter(d => 
    selectedSites.includes(d.siteID) && 
    selectedYears.includes(d.year) &&
    selectedYdays.includes(d.yday)
  );
}

export function getAggregatedData(selectedAggregators, dtFiltered, dtYDAYFiltered, dtYDAY_Week_Filtered, dtYDAY_Month_Filtered) {
  let aggregatedData;
  if(selectedAggregators === "Monthly") {
     aggregatedData = dtYDAY_Month_Filtered;
  } else if (selectedAggregators === "Weekly") {
     aggregatedData = dtYDAY_Week_Filtered;
  } else if (selectedAggregators === "Daily") {
     aggregatedData = dtYDAYFiltered;
  } else if (selectedAggregators === "15 Minute") {
     aggregatedData = dtFiltered;
  }
  
  aggregatedData = aggregatedData.map(d => {
    if (d.dischargeLog10 === "NA") {
      d.dischargeLog10 = null;
    }
    return d;
  });

  return aggregatedData;
}
