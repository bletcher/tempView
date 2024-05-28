// See https://observablehq.com/framework/config for documentation.
export default {
  // The project’s title; used in the sidebar and webpage titles.
  title: "Temperature Data Viewer",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
   pages: [
     {
       name: "Chapters",
       pages: [
         {name: "Temperature", path: "/temperatureData"},
        // {name: "Temperature2", path: "/temperatureData2"},
         {name: "Flow and temperature", path: "/temperatureFlowData"}
        // {name: "Parquet test", path: "/parquetTest"},
        // {name: "duckDB test", path: "/duckDBTest"}
       ]
     }
   ],

  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  // footer: "Built with Observable.", // what to show in the footer (HTML)
  // toc: true, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
   root: "docs", // path to the source root for preview
   output: "dist", // path to the output root for build
   search: true, // activate search
   cleanUrls: false // use URLs with .html
};
