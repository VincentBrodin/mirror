import { useEffect, useState, type ReactNode } from "react";
import useInterval from "../hooks/interval";
import { FaAngleUp, FaAngleDown, } from "react-icons/fa";
import { FaWind, FaGlasses, FaCloud } from "react-icons/fa6";
import OpenWeatherMap from "openweathermap-ts";
import type { CurrentResponse } from "openweathermap-ts/dist/types";

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
    <div className={`${className} flex flex-col justify-center items-center gap-8 uppercase`}>
      {weather == null && (
        <p>Could not fetch weather...</p>
      )}
      {weather != null && (
        <>
          <div className="flex flex-row justify-center items-center gap-8">
            <WeatherGauge value={weather.clouds.all} suffix={"%"} title={"CLOUD"} icon={<FaCloud className="text-2xl" />} />
            <WeatherGauge value={weather.wind.speed} suffix={" m/s"} title={"WIND"} icon={<FaWind className="text-xl" />} />
            <WeatherGauge value={(weather.visibility / 10_000) * 100} suffix={"%"} title={"RANGE"} icon={<FaGlasses className="text-xl" />} />
          </div>

          <div className="flex flex-row justify-center items-center gap-4 text-lg">
            <div className="opacity-75 text-cyan-500 flex flex-row justify-center items-center gap-2">
              <FaAngleDown />
              <p>{weather.main.temp_min}</p>
            </div>
            <p>{weather.main.temp}</p>
            <div className="opacity-75 text-red-500 flex flex-row justify-center items-center gap-2">
              <FaAngleUp />
              <p>{weather.main.temp_max}</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}


interface WeatherGaugeProps {
  value: number;
  suffix: string;
  title: string;
  icon: ReactNode;
}

function WeatherGauge({ value, suffix, title, icon }: WeatherGaugeProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-4 text-center">
      <p className="text opacity-75 font-big">// {title}</p>
      <div
        className="radial-progress flex flex-col justify-center items-center"
        style={{ "--value": value, "--size": "6rem", "--thickness": "5px" } as React.CSSProperties}
        aria-valuenow={value}
        role="progressbar">
        {icon}
        <p className="text-lg">{value}{suffix}</p>
      </div>
    </div>
  );
}
