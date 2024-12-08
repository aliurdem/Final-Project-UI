import React from 'react'
import AppBar from '../components/HomePage/AppBar'
import BridgeDiscover from '../components/HomePage/BridgeDiscover'
import SearchBox from '../components/HomePage/SearchBox'
import Slider from '../components/HomePage/Slider'
import TravelRoutes from '../components/HomePage/TravelRoutes'
import Footer from '../components/HomePage/Footer'

const HomePage = () => {
  return (
    <div>
     <AppBar/>
     <BridgeDiscover/>
     <SearchBox/>
     <Slider/>
     <TravelRoutes/>
     <Footer/>
    </div>
  )
}

export default HomePage
