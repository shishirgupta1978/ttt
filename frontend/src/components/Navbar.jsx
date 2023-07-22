import React,{useState,useContext} from 'react'
import {MyContext} from '..';
import {NavLink} from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import {MDBContainer,MDBNavbar,MDBNavbarBrand, MDBNavbarToggler, MDBIcon, MDBNavbarNav, MDBNavbarItem, MDBNavbarLink, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBCollapse } from 'mdb-react-ui-kit';
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { NoProfileImg,LogoImg } from '..';

export const Navbar = () => {
  const { context,setContext } = useContext(MyContext);
  const navigate = useNavigate();


	const logoutHandler = () => {
    localStorage.removeItem("Tokens");
     	    setContext({...context,user:null});

		navigate("/");
	};

  const [showBasic, setShowBasic] = useState(false);



	return (
    <>
        <MDBNavbar sticky  expand='lg' style={{backgroundColor: '#3d4a61' }} dark  >
        <MDBContainer fluid>
          <MDBNavbarBrand tag={NavLink} to="/"><img src={LogoImg} height="30px"/></MDBNavbarBrand>
  
                  {context.user && context.user ? <>   <MDBNavbarToggler
            aria-controls='navbarSupportedContent'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setShowBasic(!showBasic)}
          >
            <MDBIcon icon='bars' fas />
          </MDBNavbarToggler>
  
          <MDBCollapse navbar show={showBasic}>
            <MDBNavbarNav className='ml-auto mb-2 mb-lg-0 justify-content-end' >
              
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
                  <MDBDropdownItem tag={NavLink}  className='nav-link bg-dark' to="/profile">Profile</MDBDropdownItem>
                  <MDBDropdownItem  className='nav-link bg-dark' to="/changepassword" tag={NavLink}>Change Password</MDBDropdownItem>
                  <MDBDropdownItem  className='nav-link bg-dark' tag={NavLink} onClick={logoutHandler}><FaSignOutAlt /> Logout</MDBDropdownItem>
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
