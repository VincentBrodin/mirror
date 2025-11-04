import type { ReactNode } from "react";

interface SmartGaugeProps {
  value: number;
  text: string;
  title: string;
  icon: ReactNode;
}

export default function SmartGauge({ value, text, title, icon }: SmartGaugeProps) {

  return (
    <div className={`flex flex-col justify-center items-center gap-2 text-center`}>
      <p className="text opacity-75 font-big">// {title}</p>
      <div
        className="radial-progress flex flex-col justify-center items-center"
        style={{ "--value": value, "--size": "6rem", "--thickness": "5px" } as React.CSSProperties}
        aria-valuenow={value}
        role="progressbar">
        {icon}
        <p className="text-sm">{text}</p>
      </div>
    </div>
  );
}
