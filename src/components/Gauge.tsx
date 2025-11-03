import type { ReactNode } from "react";

interface GaugeProps {
  value: number;
  suffix: string;
  title: string;
  icon: ReactNode;
  stress: boolean;
}

export default function Gauge({ value, suffix, title, icon, stress }: GaugeProps) {

  return (
    <div className={`flex flex-col justify-center items-center gap-4 text-center ${getColor(stress, value)} ${getBloom(stress, value)}`}>
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


function getColor(stress: boolean, value: number): string {
  if (!stress) return "text-white"; // default/static color
  const v = Math.min(Math.max(value, 0), 100);
  if (v < 50) return "text-green-500";
  if (v < 80) return "text-yellow-500";
  return "text-red-500";
}

function getBloom(stress: boolean, value: number): string {
  if (!stress) return "bloom-white"; // default/static color
  const v = Math.min(Math.max(value, 0), 100);
  if (v < 50) return "bloom-green";
  if (v < 80) return "bloom-yellow";
  return "bloom-red";
}
