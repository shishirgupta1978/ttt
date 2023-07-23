import React,{useContext,useEffect,useState} from 'react'
import {MyContext, Dashboard} from '..';
import { NavLink } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { getAccessToken,removeUser } from '..';

export const HomePage = () => {
  const { context,setContext } = useContext(MyContext);


  return (
    <div>

         {context.user  ? <>      
 <Dashboard session="<p>RW</p>" /></> : <section className="container">
            <div className="p-1 mb-4  rounded-3">
                <div className="container-fluid">
                    <h1 className="display-5 fw-bold">Alt Text Generator</h1>
                    <p className="col-md-12 fs-4">
Our Alt Text Generator System utilizes state-of-the-art artificial intelligence technology, specifically trained to provide accurate and descriptive alternative text for images. By harnessing the power of deep learning and natural language processing, we have created a tool that can automatically generate alt text, enriching the online experience for individuals with visual impairments or those utilizing screen readers.</p>
<p className="col-md-12 fs-4">With our system, the process of generating alt text becomes effortless, efficient, and highly reliable. Gone are the days of manual alt text creation, which can be time-consuming and prone to human error. Our advanced algorithms analyze each image's content, context, and composition, enabling them to generate precise alt text that captures the essence and meaning of the visuals.</p>
                    <NavLink  style={{backgroundColor: '#3d4a61' }} className="btn btn-lg text-white" to="/login" >Getting Started</NavLink>
                </div>

            </div>
        </section>}
        
      
    </div>
  )
}

