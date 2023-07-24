import React,{useState,useContext} from 'react'
import {MyContext} from '..';
import {NavLink} from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import {MDBFooter } from 'mdb-react-ui-kit';
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

export const Footer = () => {
  const { context,setContext } = useContext(MyContext);

	return (
        <MDBFooter  style={{backgroundColor: '#3d4a61',maxHeight:'4vh' }} className='text-center text-lg-left fixed-bottom '>
        <div className=' text-white text-center p-2' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        Copyright &copy; {new Date().getFullYear()} aptaracorp.com. All rights reserved.
        </div>
      </MDBFooter>
	);
};
