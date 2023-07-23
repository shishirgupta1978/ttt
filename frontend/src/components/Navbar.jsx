import React,{useState,useEffect,useContext} from 'react'
import jwt_decode from 'jwt-decode';
import { getAccessToken, refresh } from '..';
import {MyContext} from '..';
import { removeUser } from '..';
import {NavLink} from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import {MDBContainer,MDBNavbar,MDBNavbarBrand, MDBNavbarToggler, MDBIcon, MDBNavbarNav, MDBNavbarItem, MDBNavbarLink, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBCollapse } from 'mdb-react-ui-kit';
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import {BiRefresh} from "react-icons/bi"
import { NoProfileImg,LogoImg } from '..';



export const Navbar = () => {


  const { context,setContext } = useContext(MyContext);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timer, setTimer] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);
  
  useEffect(() => {
    // Get the JWT token from wherever it's stored in your app
    const storedJwtToken = getAccessToken()
  
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
          removeUser();
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
    const minutes = String(Math.floor(timeInMillis / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((timeInMillis % 60000) / 1000)).padStart(2, '0');

  return `${minutes}:${seconds}`;

      
  };
  
  
  
  
  
  const session = <>{timeLeft !== null ? (
  <> {formatTime(timeLeft)}</>
  ) : (
  ""
  )}    </>
  
  
  
  


  const navigate = useNavigate();


	const logoutHandler = () => {
 removeUser();
     	    setContext({...context,user:null});
		navigate("/");
	};

  const [showBasic, setShowBasic] = useState(false);



	return (
    <>
        <MDBNavbar sticky  expand='lg' style={{backgroundColor: '#3d4a61' }} dark  >
        <MDBContainer fluid>
          <MDBNavbarBrand tag={NavLink} to="/"><img src={LogoImg} height="30px"/></MDBNavbarBrand>
  
                  {context.user && context.user ? <>
               
                     <MDBNavbarToggler
            aria-controls='navbarSupportedContent'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setShowBasic(!showBasic)}
          >
            <MDBIcon icon='bars' fas />
          </MDBNavbarToggler>
  
          <MDBCollapse navbar show={showBasic}>
            <MDBNavbarNav className='ml-auto mb-2 mb-lg-0 justify-content-end' >
            <MDBNavbarItem onClick={()=>{refresh(setContext);}} className='nav-link' tag={NavLink}><BiRefresh style={{ width: '28px', height: '28px' }}/>Time Left: <span style={{color:'yellow'}}>{session}</span></MDBNavbarItem>
            
              <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle  tag={NavLink} className='nav-link' role='button'>
                 Hi, {context.user.username.toUpperCase() } <img
                src={context.user.pdrofile_pic ? context.user.profile_pic : NoProfileImg}
                alt=''
                style={{ width: '28px', height: '28px' }}
                className='rounded-circle'
              />

                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem tag={NavLink} style={{backgroundColor: '#3d4a61' }} className='nav-link' to="/profile">Profile</MDBDropdownItem>
                  <MDBDropdownItem  className='nav-link' style={{backgroundColor: '#3d4a61' }} to="/changepassword" tag={NavLink}>Change Password</MDBDropdownItem>
                  <MDBDropdownItem  className='nav-link' tag={NavLink} style={{backgroundColor: '#3d4a61' }} onClick={logoutHandler}><FaSignOutAlt /> Logout</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>
            </MDBNavbarNav>
          </MDBCollapse></>:<MDBNavbarLink className='nav-link text-white' tag={NavLink} to="/login"><FaSignInAlt/> Login</MDBNavbarLink>}
        </MDBContainer>
      </MDBNavbar>
      </>
	);
};
