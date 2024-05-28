

```js
 const tmp = DuckDBClient.of({
  PA_01FL: FileAttachment("./data/parquet/siteID=PA_01FL/part-0.parquet"),
  PA_02FL: FileAttachment("./data/parquet/siteID=PA_02FL/part-0.parquet")
 });


```

```js
 const tmp0 = DuckDBClient.of([
  FileAttachment("./data/parquet/siteID=PA_01FL/part-0.parquet"),
  FileAttachment("./data/parquet/siteID=PA_02FL/part-0.parquet")
 ]);

```


display(tmp)
```js
display(tmp)
```

```js
//const data = tmp.sql`SELECT * FROM PA_01FL`
const data = tmp.sql`SELECT * FROM PA_01FL UNION ALL SELECT * FROM PA_02FL`

```

display(data)
```js
display(data)
```

Inputs.table(data)
```js
Inputs.table(data)
```

[...data]
```js
[...data]
```

```js
function plotAirWater(dIn, {width} = {}) {
return Plot.plot({
    width,
    marginTop: 30,
    marginRight: 50,
    //color: {...colorScale, legend: true, label: "Day of year"},
    //style: {
    //  backgroundColor: "lightgray",
    //},
    x: {label: "Air temperature (C)"},
    y: {label: "Water temperature (C)"},
    marks: [
      Plot.frame({stroke: "lightgrey"}),
      Plot.dot(dIn, 
        {
          x: "airTemperature", 
          y: "waterTemperature"
          //stroke: selectedShowAWLines ? "lightgrey" : null,
          //fy: "year",
          //fx: "siteID",
          //arrow: true
        }
      )
    ]
});
};

plotAirWater([...data])
```

## tother way



```js
const siteIDs = ['PA_01FL', 'PA_02FL'];

const siteIDText = 
  `PA_01FL: FileAttachment("./data/parquet/siteID=PA_01FL/part-0.parquet"),
   PA_02FL: FileAttachment("./data/parquet/siteID=PA_02FL/part-0.parquet")`
```

```js
display(siteIDText)
```

```js
 const tmp10 = DuckDBClient.of({
   ${siteIDText}
 });
```

```js
//const data = tmp.sql`SELECT * FROM PA_01FL`
const data10 = tmp10.sql`SELECT * FROM PA_01FL UNION ALL SELECT * FROM PA_02FL`

```

display(data)
```js
display(data10)
```

Inputs.table(data)
```js
Inputs.table(data10)
`