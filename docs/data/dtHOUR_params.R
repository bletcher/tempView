######
# NOTE: this script needs to be run by hand. It is not a data loader. I am not sure how to read in data loader files into R.
# NOTE: the code could also be refactored a lot by writing funcions for the repeated code.

# Note: to force a rerun of this script, run  `rm docs/.observablehq/cache/data/*.csv`, re-run the dtHOUR_params.R script and run `npm run build`. The data loaders are not responsive to changes in the R script.
######

library(readr)
library(lubridate)
library(tidymodels)
library(purrr)
library(broom)
library(minpack.lm)
library(tidyverse)

source("./docs/data/rForSourcing.R") # getDT <- function(d) {...}
minDataLength <- 20

#dt0 <- as_tibble(readRDS("./docs/data/EcoDrought_Continuous_VA.rds"))
dt0 <- as_tibble(readRDS("./docs/data/dt.EcoDrought.flowtemp.rds"))

dt <- getDT(dt0)

dtHOUR <- dt |>
  group_by(siteID, year, yday, hour) |>
  summarize(
    n = n(),
    #date = unique(date(dateTime)),
    airTemperature = mean(airTemperature, na.rm = TRUE),
    waterTemperature = mean(waterTemperature, na.rm = TRUE),
    #gage = mean(gage, na.rm = TRUE),
    #discharge = mean(discharge, na.rm = TRUE),
    #dischargeLog10 = mean(dischargeLog10, na.rm = TRUE),
    #airPressure = mean(airPressure, na.rm = TRUE),
    yday = mean(yday, na.rm = TRUE),
    season = unique(season, na.rm = TRUE)
  )

extract_params <- function(model) {
  if (is.null(model)) {
    return(NULL)
  }
  
  params <- tryCatch({
    broom.mixed::tidy(model)
  }, error = function(e) {
    NULL
  })
  
  return(params)
}

### Models for air temperature ################################################
curve_fit_air <- function(d) {
  if (length(d$airTemperature) < minDataLength) {
    return(list(model = NA, rSquared = NA))
  }
  d$hour_rad <- d$hour * (2 * pi / 24)
  startAir <- list(A = -1, B = -1, C = mean(d$airTemperature, na.rm = TRUE))

  modelAir <- tryCatch({
    nlsLM(airTemperature ~ A * sin(hour_rad) + B * cos(hour_rad) + C, data = d, start = startAir)
  }, error = function(e) {
    return(list(model = NA, rSquared = NA))
  })

  # rSquared calculation
  residuals <- residuals(modelAir)
  sst <- sum((d$airTemperature - mean(d$airTemperature))^2)
  ssr <- sum(residuals^2)
  rSquared <- 1 - (ssr / sst)

  return(list(model = modelAir, rSquared = rSquared))
}

modelsAir <- dtHOUR %>%
  group_by(siteID, year, yday) %>%
  nest() %>%
  mutate(dataLength = map_dbl(data, ~length(.x$airTemperature))) |>
  filter(dataLength > minDataLength) |> # filter out daily datasets that are too short
  mutate(
    model0 = map(data, curve_fit_air),
    model = map(model0, 'model'),
    rSquared = map(model0, 'rSquared'),
    params = map(model, extract_params)
  ) %>%
  unnest(c(params, rSquared)) |>
  select(-model0, -model, -data) |>
  mutate(tempVar = "air")

# find the biggest pValue among the ABC paramerter estimates
pValuesAir <- modelsAir |>
  group_by(siteID, year, yday) |>
  summarize(
    pMax = max(p.value),
    pMin = min(p.value)
  ) |>
  ungroup() |>
  mutate(tempVar = "air")

### Models for water temperature ################################################
curve_fit_water <- function(d) {
  if (length(d$waterTemperature) < minDataLength) {
    return(NA)
  }
  d$hour_rad <- d$hour * (2 * pi / 24)
  start <- list(A = -1, B = -1, C = mean(d$waterTemperature, na.rm = TRUE))

  modelWater <- tryCatch({
    nlsLM(waterTemperature ~ A * sin(hour_rad) + B * cos(hour_rad) + C, data = d, start = start)
  }, error = function(e) {
    NA
  })

  return(modelWater)
}

modelsWater <- dtHOUR %>%
  group_by(siteID, year, yday) %>%
  nest() %>%
  mutate(model = map(data, curve_fit_water),
         params = map(model, extract_params)) %>%
  unnest(params) |>
  select(-model, -data, -x) |>
  mutate(tempVar = "water")

curve_fit_water <- function(d) {
  if (length(d$waterTemperature) < minDataLength) {
    return(list(model = NA, rSquared = NA))
  }
  d$hour_rad <- d$hour * (2 * pi / 24)
  startWater <- list(A = -1, B = -1, C = mean(d$waterTemperature, na.rm = TRUE))

  modelWater <- tryCatch({
    nlsLM(waterTemperature ~ A * sin(hour_rad) + B * cos(hour_rad) + C, data = d, start = startWater)
  }, error = function(e) {
    return(list(model = NA, rSquared = NA))
  })

  # rSquared calculation
  residuals <- residuals(modelWater)
  sst <- sum((d$waterTemperature - mean(d$waterTemperature))^2)
  ssr <- sum(residuals^2)
  rSquared <- 1 - (ssr / sst)

  return(list(model = modelWater, rSquared = rSquared))
}

modelsWater <- dtHOUR %>%
  group_by(siteID, year, yday) %>%
  nest() %>%
  mutate(dataLength = map_dbl(data, ~length(.x$waterTemperature))) |>
  filter(dataLength > minDataLength) |> # filter out daily datasets that are too short
  mutate(
    model0 = map(data, curve_fit_water),
    model = map(model0, 'model'),
    rSquared = map(model0, 'rSquared'),
    params = map(model, extract_params)
  ) %>%
  unnest(c(params, rSquared)) |>
  select(-model0, -model, -data) |>
  mutate(tempVar = "water")

pValuesWater <- modelsWater |>
  group_by(siteID, year, yday) |>
  summarize(
    pMax = max(p.value),
    pMin = min(p.value)
  ) |>
  ungroup() |>
  mutate(tempVar = "water")
################################################################################
pValues <- bind_rows(pValuesAir, pValuesWater)

models <- bind_rows(modelsAir, modelsWater) |>
  filter(!is.na(term)) |>
  #group_by(siteID, year, yday, tempVar) |>
  select(-std.error, -statistic, -p.value) |> # need to lose these columns so there are no unique values remaining in non-widened cols
  pivot_wider(names_from = term, values_from = estimate) |>
  left_join(pValues, by = c("siteID", "year", "yday", "tempVar"))

params <- models |>
  group_by(siteID, year, yday, tempVar) |>
  mutate(
    amplitude = sqrt(A^2 + B^2),
    phase = ifelse(A < 0,
      12 + (24 / (2 * pi)) * atan(B / A), #switched order of A and B per Tim's email 5/17/24
      (24 / (2 * pi)) * atan(B / A)
    )
  ) |>
  left_join(
    dtHOUR |> select(siteID, year, yday, season) |> distinct(), by = c("siteID", "year", "yday")
  )

# Write to csv so we can read this into other R scripts. This is not a reactive data loader.
write_csv(params, "./docs/data/dtHOUR_params.csv")
#cat(format_csv(params))

table(params$siteID)

#   siteID   year  yday dataLength rSquared tempVar       A      B     C     pMax
#   <chr>   <dbl> <dbl>      <dbl>    <dbl> <chr>     <dbl>  <dbl> <dbl>    <dbl>
# 1 PA_01FL  2018   296         24   0.900  air     -4.47   -3.09  10.7   1.15e-7
# 2 PA_01FL  2018   297         24   0.767  air     -2.45   -1.42   6.79  4.48e-4
 

 #ggplot(params, aes(x = yday, y = phase, color = tempVar)) +
 # geom_point() +
 # geom_smooth(method = "lm", se = FALSE) +
 # facet_wrap(year~siteID) 
