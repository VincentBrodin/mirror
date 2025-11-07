import { SpotifyApi, type PlaybackState } from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import useInterval from "../hooks/interval";
import Gauge from "./Gauge";

interface SpotifyModuleProps {
  className: string;
}
export default function SpotifyModule({ className }: SpotifyModuleProps) {
  const [track, setTrack] = useState<PlaybackState | null>(null);
  const [sdk, setSdk] = useState<SpotifyApi | null>(null);
  const [playPercent, setPlayPercent] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [fetching, setFetching] = useState<boolean>(false);
  const [start, setStart] = useState<number>(0);

  useEffect(() => {
    console.log("SETTING UP SPOTIFY");
    if (sdk === null) {
      const newSdk = SpotifyApi.withUserAuthorization(import.meta.env.VITE_SPOTIFY_CLIENT, import.meta.env.VITE_SPOTIFY_CALLBACK, ["user-read-currently-playing"]);
      setSdk(newSdk);
      getTrack();
    }
  }, []);

  const getTrack = async () => {
    if (sdk === null) {
      return;
    }
    console.log("UPDATING TRACK");
    try {
      const track = await sdk.player.getCurrentlyPlayingTrack();
      const now = new Date();
      setStart(now.getTime() - track.progress_ms);
      setTrack(track);
      setFetching(false);
    }
    catch (e) {
      setTrack(null);
      console.error("Failed to grab track: ", e);
    }

  }
  useInterval(getTrack, 1000 * 30);

  const updateState = () => {
    if (track === null || !track.is_playing) {
      return;
    }

    const now = new Date().getTime();
    const currentProgress = now - start;
    var percent = (currentProgress / track.item.duration_ms);
    if (percent >= 1) {
      percent = 1;
      if (!fetching) {
        setFetching(true);
        setTimeout(getTrack, 500);
      }
    }
    setPlayPercent(percent * 100);
    setTitle(track.item.name);
  }
  useInterval(updateState, 500);


  return (
    <div className={`${className} flex flex-col justify-center items-center gap-4 uppercase bloom-white p-4`}>
      {track !== null && track.is_playing && (
        <>
          <Gauge value={playPercent} suffix={"%"} title={"Playing"} icon={null} decimal={0} stress={false} />
          <p className="font-big uppercase text-sm">{title}</p>
        </>
      )}
    </div>
  )
}
