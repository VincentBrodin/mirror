import ClockModule from "./components/ClockModule"
import NewsModule from "./components/NewsModule"
import SpotifyModule from "./components/SpotifyModule"
import SystemModule from "./components/SystemModule"
import WeatherModule from "./components/WeatherModule"

function App() {
  return (
    <div className='w-screen h-screen grid grid-cols-2 grid-rows-3 bg-black text-white p-8 gap-4'>
      <ClockModule className="row-start-1 col-start-1" />
      <WeatherModule className="row-start-1 col-start-2" lat={59.6191} lon={17.7234} />
      <SystemModule className="row-start-3 col-start-2" />
      <NewsModule className={"row-start-3 col-start-1"} links={["https://rss.aftonbladet.se/rss2/small/pages/sections/senastenytt/", "https://www.dn.se/rss/", "https://feeds.expressen.se/nyheter/"]} />
      <SpotifyModule className={"row-start-2 col-start-1"} />
    </div>
  )
}

export default App
