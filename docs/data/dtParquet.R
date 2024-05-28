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

PQPath <- "./docs/data/parquet"

dt |>
  group_by(siteID) |>
  write_dataset(path = PQPath, format = "parquet")

tibble(
  files = list.files(PQPath, recursive = TRUE),
  size_MB = file.size(file.path(PQPath, files)) / 1024^2
)




#dtPQ <- open_dataset("./docs/data/parquet", format = "parquet")

#dtDuckDB <- dtPQ |> to_duckdb()

#print(dtPQ)
