# Note: to force a rerun of this script, run  `rm docs/.observablehq/cache/data/*.csv` and then re-run the dtHOUR_params.R script.

getDT <- function(d) {
  d2 <- d |>
    filter(str_detect(Site_ID, "^PA")) |> ################## FOR NOW
    mutate(
      station = str_sub(Station_No, 4, 13),
      airTemperatureOriginal = (AirTemperature_HOBO_degF - 32) * 5 / 9,
      waterTemperature = (WaterTemperature_HOBO_DegF - 32) * 5 / 9,
      year = year(DateTime_EST),
      month = month(DateTime_EST),
      week = week(DateTime_EST),
      hour = hour(DateTime_EST),
      yday = yday(DateTime_EST),
      hmsProp = (hour(DateTime_EST)*60*60 + minute(DateTime_EST)*60 + second(DateTime_EST))/(24*60*60),
      ydayHMS = yday + hmsProp,
      dischargeLog10 = log10(Discharge_Hobo_cfs),
    ) |>
    rename(
      siteID = Site_ID,
      dateTime = DateTime_EST,
      gage = GageHeight_Hobo_ft,
      discharge = Discharge_Hobo_cfs,
      airPressure = AirPressure_PSI
    ) |>
    dplyr::select(-Station_No) |>
    mutate(
      siteIDForAir = case_when(
        siteID == "PA_01FL" ~ "PA_01FL",
        siteID == "PA_02FL" ~ "PA_01FL",
        siteID == "PA_03FL" ~ "PA_05FL",
        siteID == "PA_04FL" ~ "PA_05FL",
        siteID == "PA_05FL" ~ "PA_05FL",
        siteID == "PA_06FL" ~ "PA_05FL",
        siteID == "PA_07FL" ~ "PA_05FL",
        siteID == "PA_08FL" ~ "PA_10FL",
        siteID == "PA_09FL" ~ "PA_10FL",
        siteID == "PA_10FL" ~ "PA_10FL",
        
        siteID == "SR_01FL" ~ "SR_01FL",
        siteID == "SR_02FL" ~ "SR_04FL",
        siteID == "SR_03FL" ~ "SR_04FL",
        siteID == "SR_04FL" ~ "SR_04FL",
        siteID == "SR_05FL" ~ "SR_04FL",
        siteID == "SR_06FL" ~ "SR_04FL",
        siteID == "SR_07FL" ~ "SR_10FL",
        siteID == "SR_08FL" ~ "SR_10FL",
        siteID == "SR_09FL" ~ "SR_10FL",
        siteID == "SR_10FL" ~ "SR_10FL",
        
        siteID == "PI_01FL" ~ "PI_01FL",
        siteID == "PI_02FL" ~ "PI_01FL",
        siteID == "PI_03FL" ~ "PI_05FL",
        siteID == "PI_04FL" ~ "PI_05FL",
        siteID == "PI_05FL" ~ "PI_05FL",
        siteID == "PI_06FL" ~ "PI_05FL",
        siteID == "PI_07FL" ~ "PI_05FL",
        siteID == "PI_08FL" ~ "PI_10FL",
        siteID == "PI_09FL" ~ "PI_10FL",
        siteID == "PI_10FL" ~ "PI_10FL",
        TRUE ~ "NA"
      )
    ) |>
    mutate(
      season = case_when(
        month %in% c(12, 1, 2) ~ "Winter",
        month %in% c(3, 4, 5) ~ "Spring",
        month %in% c(6, 7, 8) ~ "Summer",
        month %in% c(9, 10, 11) ~ "Autumn",
        TRUE ~ "NA"
      )
    )

  airTemps <- d2 |>
    select(siteID, dateTime, airTemperatureOriginal) |>
    distinct() |>
    mutate(airTemperature = airTemperatureOriginal) |>
    select(-airTemperatureOriginal)

  dOut <- d2 |>
    left_join(airTemps, by = c("siteIDForAir" = "siteID", "dateTime"))

  return(dOut)
}
