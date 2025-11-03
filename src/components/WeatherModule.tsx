import { useEffect, useState } from "react";
import useInterval from "../hooks/interval";
import { FaAngleUp, FaAngleDown, } from "react-icons/fa";
import { FaWind, FaGlasses, FaCloud, FaTemperatureArrowDown, FaTemperatureArrowUp, FaTemperatureEmpty } from "react-icons/fa6";
import OpenWeatherMap from "openweathermap-ts";
import type { CurrentResponse } from "openweathermap-ts/dist/types";
import Gauge from "./Gauge";
import Meter from "./Meter";

interface WeatherModuleProps {
  className: string;
  lat: number;
  lon: number;
}

export default function WeatherModule({ className, lat, lon }: WeatherModuleProps) {
  const [weather, setWeather] = useState<CurrentResponse | null>(null);

  const openWeather = new OpenWeatherMap({
    apiKey: import.meta.env.VITE_OPEN_WEATHER,
    units: "metric",
  });


  const updateForecast = async () => {
    console.log("UPDATE FORECAST");
    const weather = await openWeather.getCurrentWeatherByGeoCoordinates(lat, lon)
    setWeather(weather);
  }
  useEffect(() => { updateForecast() }, [lat, lon])
  useInterval(updateForecast, 10 * 60 * 1000);

  return (
    <div className={`${className} flex flex-col justify-center items-center gap-8 uppercase bloom-white`}>
      {weather == null && (
        <p>Could not fetch weather...</p>
      )}
      {weather != null && (
        <>
          <div className="grid grid-cols-3 justify-center items-center gap-8">
            <Gauge value={weather.clouds.all} stress={false} suffix={"%"} title={"CLOUD"} icon={<FaCloud className="text-xl" />} />
            <Gauge value={weather.wind.speed} stress={false} suffix={" m/s"} title={"WIND"} icon={<FaWind className="text-xl" />} />
            <Gauge value={(weather.visibility / 10_000) * 100} stress={false} suffix={"%"} title={"RANGE"} icon={<FaGlasses className="text-xl" />} />
            <Meter value={`${weather.main.temp_min}°C`} title={"MIN"} icon={<FaTemperatureArrowDown className="text-xl" />} />
            <Meter value={`${weather.main.temp}°C`} title={"NOW"} icon={<FaTemperatureEmpty className="text-xl" />} />
            <Meter value={`${weather.main.temp_max}°C`} title={"MAX"} icon={<FaTemperatureArrowUp className="text-xl" />} />
          </div>
        </>
      )}
    </div>
  )
}
