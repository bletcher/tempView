library(readr)
library(tidyverse)

paramsIn <- read_csv("./docs/data/dtHOUR_params.csv")

ampPhase <- paramsIn |>
  select(siteID, year, yday, season, tempVar, amplitude, phase, pMax, pMin, rSquared) |>
  pivot_wider(
    names_from = tempVar,
    values_from = c(amplitude, phase, pMin, pMax, rSquared)
  ) |>
  select(
    siteID, year, yday, season,
    starts_with("amplitude"),
    starts_with("phase"),
    starts_with("pM"),
    starts_with("rSquared")
  ) |>
  mutate(
    amplitudeRatio = amplitude_water / amplitude_air,
    phaseDiff = phase_water - phase_air,
    pMaxMax = pmax(pMax_air, pMax_water, na.rm = TRUE)
  )
#head(ampPhase|>select(phase_air,phase_water,phaseDiff))
cat(format_csv(ampPhase))
