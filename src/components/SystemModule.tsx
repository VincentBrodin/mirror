import PocketBase, { type RecordModel } from 'pocketbase'
import { useEffect, useState } from 'react';
import useInterval from '../hooks/interval';
import Gauge from './Gauge';
import { FaTemperatureEmpty, FaRegFloppyDisk, FaMemory, FaMicrochip } from "react-icons/fa6";
import { FaAngleUp, FaAngleDown, } from "react-icons/fa";
import prettyBytes from 'pretty-bytes';
import Meter from './Meter';

interface SystemModuleProps {
  className: string;
}

export default function SystemModule({ className }: SystemModuleProps) {
  const [system, setSystem] = useState<RecordModel | null>(null);
  const pb = new PocketBase(import.meta.env.VITE_BESZEL_URL);
  pb.autoCancellation(false);

  const updateSystem = async () => {
    console.log("UPDATE SYSTEM");
    await pb.collection('users').authWithPassword(import.meta.env.VITE_BESZEL_EMAIL, import.meta.env.VITE_BESZEL_PASSWORD);
    const res = await pb.collection('system_stats').getList(1, 1, {
      filter: `system = "${import.meta.env.VITE_BESZEL_SYSTEM}"`,
      sort: "-created",
    })

    pb.collection('system_stats').getList(1, 1, {
      filter: `system = "${import.meta.env.VITE_BESZEL_SYSTEM}"`,
      sort: "-created",
    })

    if (res.items.length > 0) {
      setSystem(res.items[0]);
      console.log(res.items[0]);
    } else {
      setSystem(null);
    }
  }
  useEffect(() => {
    updateSystem();
  }, [])
  useInterval(updateSystem, 1000 * 10);

  return (
    <div className={`${className} flex flex-col justify-center items-center gap-8 uppercase bloom-white`}>
      {system === null && (
        <p>Could not fetch system statistics...</p>
      )}
      {system !== null && system.expand === null && (
        <p>Could not load system statistics...</p>
      )}
      {system !== null && system.expand !== null && (
        <>
          <div className="grid grid-cols-3 justify-center items-center gap-8">
            <Gauge value={system.stats.cpu} stress={true} suffix={"%"} title={"cpu"} icon={<FaMicrochip className="text-xl" />} />
            <Gauge value={system.stats.mp} stress={true} suffix={"%"} title={"memory"} icon={<FaMemory className="text-xl" />} />
            <Gauge value={system.stats.dp} stress={true} suffix={"%"} title={"disk"} icon={<FaRegFloppyDisk className="text-xl" />} />
            <Gauge value={system.stats.t.coretemp_package_id_0} stress={true} suffix={"°C"} title={"temp"} icon={<FaTemperatureEmpty className="text-xl" />} />
            <Meter value={`${prettyBytes(system.stats.ns)}/s`} title={"Sent"} icon={<FaAngleUp className="text-xl" />} />
            <Meter value={`${prettyBytes(system.stats.nr)}/s`} title={"Read"} icon={<FaAngleDown className="text-xl" />} />
          </div>
        </>
      )}
    </div>
  );
}
