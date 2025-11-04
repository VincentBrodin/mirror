import React, { useState } from "react";
import useInterval from "../hooks/interval";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface ClockModuleProps {
  className: string;
}


export default function ClockModule({ className }: ClockModuleProps) {
  const [hour, setHour] = useState<string>(GetHour());
  const [minute, setMinute] = useState<string>(GetMinute());
  const [second, setSecond] = useState<string>(GetSecond());
  const [year, setYear] = useState<string>(GetYear());
  const [month, setMonth] = useState<string>(GetMonth());
  const [day, setDay] = useState<string>(GetDay());
  const [dayOfWeek, setDayOfWeek] = useState<string>(GetDayOfWeek());
  const [dayProgress, setDayProgress] = useState<number>(GetDayProgress());

  useInterval(() => {
    setHour(GetHour());
    setMinute(GetMinute());
    setSecond(GetSecond());
    setYear(GetYear());
    setMonth(GetMonth());
    setDay(GetDay());
    setDayOfWeek(GetDayOfWeek());
    setDayProgress(GetDayProgress());
  }, 1000);

  return (

    <div className={`${className} flex flex-col gap-8 justify-center items-center uppercase bloom-white p-4`} >
      <div className="radial-progress"
        style={{ "--value": dayProgress, "--size": "12rem", "--thickness": "10px" } as React.CSSProperties}
        aria-valuenow={dayProgress}
        role="progressbar">
        <p className="font-lg font-big">{hour}:{minute}:{second}</p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <p className="text-lg text-center font-big">{dayOfWeek}</p>
        <p className="text-lg opacity-75 text-center">{day} {month} {year}</p>
      </div >
    </div >
  );
}

function GetHour(): string {
  const date = new Date();
  return String(date.getHours()).padStart(2, '0');
}

function GetMinute(): string {
  const date = new Date();
  return String(date.getMinutes()).padStart(2, '0');
}
function GetSecond(): string {
  const date = new Date();
  return String(date.getSeconds()).padStart(2, '0');
}

function GetYear(): string {
  const date = new Date();
  return String(date.getFullYear());
}

function GetMonth(): string {
  const date = new Date();
  return MONTHS[date.getMonth()];
}

function GetDay(): string {
  const date = new Date();
  return String(date.getDate()).padStart(2, '0');
}


function GetDayOfWeek(): string {
  const date = new Date();
  return DAYS[date.getDay()];
}

function GetDayProgress(): number {
  const secondsInDay = 24 * 60 * 60 - 1;
  const now = new Date();
  const secondsPassed = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  return (secondsPassed / secondsInDay) * 100;
}
