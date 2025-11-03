import ClockModule from "./components/ClockModule"
import WeatherModule from "./components/WeatherModule"

function App() {
  return (
    <div className='w-screen h-screen grid grid-cols-2 grid-rows-3 bg-black text-white'>
      <ClockModule className="row-start-1 col-start-1" />
      <WeatherModule className="row-start-1 col-start-2" lat={59.6191} lon={17.7234} />
    </div>
  )
}

export default App
