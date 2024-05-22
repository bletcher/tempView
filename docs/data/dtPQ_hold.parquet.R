# This works but I con't know how to con() or print() the dtPQ object
library(readr)
library(lubridate)
library(here)
library(arrow)
library(dbplyr, warn.conflicts = FALSE)
library(duckdb)
library(tidyverse)

source("./docs/data/rForSourcing.R") # getDT <- function(d) {...}

#con <- DBI::dbConnect(duckdb::duckdb())
#duckdb::duckdb_read_rds(con, "dt0", "./docs/data/")



dt0 <- as_tibble(readRDS("./docs/data/dt.EcoDrought.flowtemp.rds")) # includes more airTemp data than EcoDrought_Continuous_VA.rds

dt <- getDT(dt0)

dt |>
  group_by(siteID) |>
  write_dataset(path = "./docs/data/parquet", format = "parquet")

dtPQ <- open_dataset("./docs/data/parquet", format = "parquet")

dtDuckDB <- dtPQ |> to_duckdb()

#print(dtPQ)
