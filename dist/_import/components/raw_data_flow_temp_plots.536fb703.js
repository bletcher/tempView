import * as Plot from "../../_npm/@observablehq/plot@0.6.14/_esm.js";
import { min, max, range } from "../../_npm/d3@7.9.0/_esm.js";


export function plotWaterDischarge(d, {width} = {}) {

  const colorScale = Plot.scale({
    color: {
      type: "cyclical",
      domain: [0, 366],
      range: ["#00f", "#e31010", "#1685f5"],
      unknown: "var(--theme-foreground-muted)"
    }
  });

  return Plot.plot({
    width,
    marginTop: 30,
    marginRight: 50,
    color: {...colorScale, legend: true, label: "Day of year"},
    x: {
      label: "Stream flow log10(cfs)"
    },
    y: {label: "Water temperature (C)"},
    marks: [
      Plot.line(d, 
        {
          x: "dischargeLog10", 
          y: "waterTemperature", 
          stroke: "lightgrey",
          fy: "year",
          fx: "siteID",
          marker: "circle-stroke"
        }
      ),
      Plot.dot(d, 
        {
          x: "dischargeLog10", 
          y: "waterTemperature", 
          stroke: "yday", 
          fy: "year",
          fx: "siteID",
          tip: true
        }
      )
    ]
  });
}
