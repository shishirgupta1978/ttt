import { Outlet } from "react-router-dom";
import {Navbar,Footer} from "../components";
import { BgImg } from "../assets";


import React from 'react'

const divStyle = {
  backgroundImage: `url(${BgImg})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  opacity: '1', // Adjust this based on how you want the image to fit the background
  // Other optional background properties (e.g., backgroundPosition, backgroundAttachment) can be added here.
  height:'100vh'
};

export const Layout = () => {
  return (
    <>
    <div style={divStyle}>
       <Navbar/>
       
      <Outlet/>
      <Footer/>
</div>      

    </>
  )
}
