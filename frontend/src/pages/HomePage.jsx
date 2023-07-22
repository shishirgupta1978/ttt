import React,{useContext,useEffect,useState} from 'react'
import {MyContext, Dashboard} from '..';
import { NavLink } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

export const HomePage = () => {
    const { context,setContext } = useContext(MyContext);
    const [timeLeft, setTimeLeft] = useState(null);
    const [timer, setTimer] = useState(null);
    const [jwtToken, setJwtToken] = useState(null);
  
    useEffect(() => {
      // Get the JWT token from wherever it's stored in your app
      const storedJwtToken = localStorage.getItem("Tokens") ? JSON.parse(localStorage.getItem("Tokens"))?.access :null
  
      if (storedJwtToken) {
        setJwtToken(storedJwtToken);
        const decodedToken = jwt_decode(storedJwtToken);
        const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeLeftInMillis = expirationTime - currentTime;
  
        // Update the state with the time left
        setTimeLeft(timeLeftInMillis);
  
        // Set up a timer to update the time left dynamically
        const intervalTimer = setInterval(() => {
          const newTimeLeft = expirationTime - Date.now();
          setTimeLeft(newTimeLeft);
  
          // Clear the interval and reset the timer when the token has expired
          if (newTimeLeft <= 0) {
            clearInterval(intervalTimer);
            setJwtToken(null); // Reset the stored token when it expires
            localStorage.removeItem("Tokens")
            setContext({...context,user:null})
          }
        }, 1000); // Update the time left every second
  
        // Store the interval timer in state
        setTimer(intervalTimer);
      }
  
      // Clean up the interval when the component unmounts or when the token changes
      return () => {
        if (timer) {
          clearInterval(timer);
        }
      };
    }, [jwtToken,context.user]); // Run the effect whenever the token changes
      
    // Helper function to convert milliseconds to human-readable time (optional)
    const formatTime = (timeInMillis) => {
      const minutes = Math.floor(timeInMillis / 60000);
      const seconds = Math.floor((timeInMillis % 60000) / 1000);
        return `${minutes}m:${seconds}s`;
    };
  



  
const session = <div>{timeLeft !== null ? (
  <p >&nbsp;Session will expire after: {formatTime(timeLeft)}</p>
) : (
  <p>No JWT token found.</p>
)}    </div>

  return (
    <div>

         {context.user  ? <>      
 <Dashboard session={session} /></> : <section className="container">
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

