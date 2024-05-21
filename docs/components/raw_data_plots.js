import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function plotTimeSeries(d, groupSiteID, showWater, showAir, selectedFacetYearly, {width} = {}) {
  let clickedData = [];

  const colorScale = Plot.scale({
    color: {
      type: "categorical",
      domain: groupSiteID,
      unknown: "var(--theme-foreground-muted)"
    }
  });

  const tsPlot = Plot.plot({
    //width,
    width: 1800, // need to make this responsive ////////////////////////////////
    marginTop: 30,
    marginRight: 50,
    //color: {...d => colorScale.includes(d.siteID), legend: true},
    color: {...colorScale, legend: false},
    //x: {domain: selectedFacetYearly ? [0,366] : d3.extent(d => d.dateTime), label: "Day of year"},
    y: {label: "Temperature (C)"},
    marks: [
      Plot.line(d, 
        {
          x: selectedFacetYearly ? "ydayHMS" : "dateTime",
          y: showAir ? "airTemperature" : "null", 
          stroke: "grey", 
          fy: selectedFacetYearly ? "year" : "null",
          fx: "siteID",
          tip: true
        }
      ),
      Plot.line(d, 
        {
          legend: true,
          x: selectedFacetYearly ? "ydayHMS" : "dateTime", 
          y: showWater ? "waterTemperature" : "null", 
          stroke: "siteID", 
          fy: selectedFacetYearly ? "year" : "null",
          fx: "siteID"
        }
      )
    ]
  });

  return tsPlot;
}
  
export function plotAirWater(d, selectedShowAWLines, {width} = {}) {

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
    x: {label: "Air temperature (C)"},
    y: {label: "Water temperature (C)"},
    marks: [
      Plot.line(d, 
        {
          x: "airTemperature", 
          y: "waterTemperature", 
          stroke: selectedShowAWLines ? "lightgrey" : null,
          fy: "year",
          fx: "siteID",
          arrow: true
        }
      ),
      Plot.dot(d, 
        {
          x: "airTemperature", 
          y: "waterTemperature", 
          stroke: "yday",
          fy: "year",
          fx: "siteID",
          tip: true
        }
      ),
      Plot.linearRegressionY(d, 
        {
          x: "airTemperature", 
          y: "waterTemperature", 
          stroke: "darkgrey", 
          fy: "year",
          fx: "siteID",
          tip: false
        }
      )
    ]
  });
}

export function plotWaterDischarge(d, {width} = {}) {

  const colorScale = Plot.scale({
    color: {
      type: "cyclical",
      domain: [0, 366],
      unknown: "var(--theme-foreground-muted)"
    }
  });

  return Plot.plot({
    width,
    marginTop: 30,
    marginRight: 50,
    color: {...colorScale, legend: true, label: "Day of year"},
    x: {label: "Stream flow (cfs)"},
    y: {label: "Water temperature (C)"},
    marks: [
      Plot.dot(d, 
        {
          x: "discharge", 
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

export function plotCurve(d, {width} = {}) {

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
    x: {label: "Hour of the day"},
    y: {label: "Temperature (C)"},
    marks: [
      Plot.line(d, 
        {
          x: "hour", 
          y: "waterTemperature", 
          stroke: "yday", 
          fy: "year",
          fx: "siteID"
          //tip: true
        }
      ),
      Plot.line(d, 
        {
          x: "hour", 
          y: "airTemperature", 
          stroke: "yday",
          marker: "circle-stroke", 
          fy: "year",
          fx: "siteID",
          tip: true
        }
      )
    ]
  });
}

export function plotCurveHover(dIn, dInPred, timeSeriesHover,  {width} = {}) {

  if (timeSeriesHover === null) {
    return Plot.plot({
      //title:  `Mouse over the time series chart above to see the hourly chart for the selected site, year, and day of year.`,
      title: "Mouse over the chart above.",
      width,
      marginTop: 30,
      marginRight: 50,
      x: {label: "Hour of the day"},
      y: {label: "Temperature (C)"},
      marks: []
    });
  } else {
    const d = dIn.filter(dd => 
      dd.siteID === timeSeriesHover.siteID &&
      dd.year === timeSeriesHover.year &&
      dd.yday === timeSeriesHover.yday
    );

    const dPred = dInPred.filter(dd => 
      dd.siteID === timeSeriesHover.siteID &&
      dd.year === timeSeriesHover.year &&
      dd.yday === timeSeriesHover.yday
    );


    return Plot.plot({
      title:  `Site ID: ${timeSeriesHover.siteID}, Year: ${timeSeriesHover.year}, Yday: ${timeSeriesHover.yday}`,
      width,
      marginTop: 30,
      marginRight: 50,
      x: {label: "Hour of the day"},
      y: {label: "Temperature (C)"},
      marks: [
        Plot.line(d, 
          {
            x: "hour", 
            y: "waterTemperature",
            stroke: "blue",
            marker: "circle-stroke"
            //tip: true
          }
        ),
        Plot.line(d, 
          {
            x: "hour", 
            y: "airTemperature", 
            stroke: "darkgrey",
            marker: "circle-stroke",
            tip: true
          }
        ),
        Plot.line(dPred.filter(dd => dd.tempVar === "water"), 
          {
            x: "hour", 
            y: "predTemp",
            stroke: "blue"
            //marker: "circle-stroke"
            //tip: true
          }
        ),
        Plot.line(dPred.filter(dd => dd.tempVar === "air"), 
        {
          x: "hour", 
          y: "predTemp",
          stroke: "darkgrey"
          //marker: "circle-stroke"
          //tip: true
        }
      )
      ]
    });
  }
}


export function plotPhaseAmp(d, {width} = {}) {
  
  // for 2nd y-axis
  // https://observablehq.com/@observablehq/plot-dual-axis
  const v1 = (d) => d.amplitudeRatio;
  const v2 = (d) => d.phaseDiff;
  const y2 = d3.scaleLinear(d3.extent(d, v2), d3.extent(d, v1));
  //const y2 = d3.scaleLinear(d3.extent(d, v2), [0, d3.max(d, v1)]);

  return Plot.plot({
    width,
    marginTop: 30,
    marginRight: 30,
    //color: {legend: true, label: "Day of year"},
    x: {label: "Day of year"},
    y: {axis: "left", label: "Amplitude"},
    marks: [
      Plot.dot(d.filter(d => d.pMaxMax < 0.05), // only show significant pMaxMax values
        {
          x: "yday", 
          y: "amplitudeRatio", 
          stroke: "grey",
          //r: d => d.pMaxMax/50,  
          fy: "year",
          fx: "siteID",
          tip: true
        }
      ),

      Plot.axisY(y2.ticks(), 
        {
          color: "#870c10", 
          anchor: "right", 
          label: "Phase difference",
          y: y2, 
          tickFormat: y2.tickFormat()
        }
      ), 

      Plot.ruleY([0]),

      Plot.dot(d, //.filter(d, => d.pMaxMax < 0.05), // only show significant pMaxMax values
        Plot.mapY((D) => D.map(y2),  
          {
            x: "yday", 
            y: "phaseDiff", 
            stroke: "#870c10",
            //alpha: "pMaxMax",//d => d.pMaxMax/50,  
            fy: "year",
            fx: "siteID",
            tip: true
          }
      ))
    ]
  });
}