import type { ReactNode } from "react";

interface MeterProps {
  value: string;
  title: string;
  icon: ReactNode;
}

export default function Meter({ value, title, icon }: MeterProps) {
  return (
    <div className="flex flex-col justify-between items-center gap-2 text-center h-full">
      <p className="text opacity-75 font-big">// {title}</p>
      <div className="flex flex-col justify-center items-center text-center h-full">
        {icon}
        <p className="text-lg">{value}</p>
      </div>
    </div>
  );
}
