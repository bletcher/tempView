library(readr)
library(lubridate)
library(here)
library(tidyverse)

source("./docs/data/rForSourcing.R") # getDT <- function(d) {...}

dt0 <- as_tibble(readRDS("./docs/data/dt.EcoDrought.flowtemp.rds")) # includes more airTemp data than EcoDrought_Continuous_VA.rds

dt <- getDT(dt0)

#write.csv(dt, "./docs/data/dt.csv") # this gives a date error when read into the app
#write_json(dt, "./docs/data/dt.json")

cat(format_csv(dt))
