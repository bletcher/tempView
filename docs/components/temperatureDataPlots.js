import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import regression from 'regression';

export function plotAirWater(dIn, selectedShowAWLines, {width} = {}) {

  const d = dIn.filter(dd => !isNaN(dd.airTemperature) && !isNaN(dd.waterTemperature))
  const groupedData = d3.group(d, d => d.siteID, d => d.year);

  // Calculate a separate regression for each group
  const regressions = Array.from(groupedData, ([siteID, years]) => {
    return Array.from(years, ([year, data]) => {
      const pairs = data.map(d => [d.airTemperature, d.waterTemperature]);
      const linReg = regression.linear(pairs)
      const slope = linReg.equation[0];
      const intercept = linReg.equation[1];

      return {
        siteID,
        year,
        slope,
        intercept
      };
    });
  }).flat();

  const xAxisRel = d3.quantile(
    d.map(d => d.airTemperature).sort(d3.ascending),
    0.01
  );

  const yAxisRel = d3.quantile(
    d.map(d => d.waterTemperature).sort(d3.ascending),
    0.7
  );
  

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
    //style: {
    //  backgroundColor: "lightgray",
    //},
    x: {label: "Air temperature (C)"},
    y: {label: "Water temperature (C)"},
    marks: [
      Plot.frame({stroke: "lightgrey"}),
      Plot.line(dIn, 
        {
          x: "airTemperature", 
          y: "waterTemperature", 
          stroke: selectedShowAWLines ? "lightgrey" : null,
          fy: "year",
          fx: "siteID",
          arrow: true
        }
      ),
      Plot.dot(dIn, 
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
      ),
      Plot.text(regressions, 
        {
          text: d => `Slope: ${d.slope.toFixed(2)}`, // Format the slope to 2 decimal places
          x: xAxisRel, 
          y: yAxisRel,
          fy: "year",
          fx: "siteID",
          fill: "black"
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

export function plotCurveHover(dIn, dInPred, timeSeriesHover, groupSiteID,  {width} = {}) {

  const colorScale = Plot.scale({
    color: {
      type: "categorical",
      domain: groupSiteID,
      unknown: "var(--theme-foreground-muted)"
    }
  });

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
      color: {...colorScale, legend: false},
      x: {label: "Hour of the day"},
      y: {label: "Temperature (C)"},
      marks: [
        Plot.line(d, 
          {
            x: "hour", 
            y: "waterTemperature",
            stroke: "siteID",
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
            stroke: "siteID"
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
      Plot.frame({stroke: "lightgrey"}),
      Plot.dot(d,
        {
          x: "yday", 
          y: "amplitudeRatio", 
          stroke: "grey", 
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

      Plot.dot(d,
        Plot.mapY((D) => D.map(y2),  
          {
            x: "yday", 
            y: "phaseDiff", 
            stroke: "#870c10",  
            fy: "year",
            fx: "siteID",
            tip: true
          }
      ))
    ]
  });
}

export function plotPhaseAmpXY(d, years, {width} = {}) {
  
  const colorScale = Plot.scale({
    color: {
      type: "categorical",
      domain: [...new Set(d.map(d => d.year))].sort(), //years,
      unknown: "var(--theme-foreground-muted)"
    }
  });

  return Plot.plot({
    width,
    marginTop: 30,
    marginRight: 70,
    color: {...colorScale, legend: true},
    x: {label: "Phase difference"},
    y: {axis: "left", label: "Amplitude"},
    marks: [
      Plot.frame({stroke: "lightgrey"}),
      Plot.dot(d,
        {
          x: "phaseDiff", 
          y: "amplitudeRatio", 
          stroke: "year", 
          //fy: "year",
          fy: "siteID",
          tip: true
        }
      )
    ]
  });
}