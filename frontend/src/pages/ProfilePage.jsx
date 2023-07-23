import React, { useEffect, useState,useContext } from "react";
import {MDBInput,MDBBtn,MDBCol,MDBContainer,  MDBRow} from "mdb-react-ui-kit";
import { useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {Spinner,Title} from "../components";
import {MyContext,axiosApi} from "..";
import { NoProfileImg } from "..";

export const ProfilePage = () => {
	const {uid} =useParams()
	const [id,setId]  = useState(uid);
  
	const [loadData, setLoadData] = useState({ 'is_loading': false, 'is_error': false, 'is_success': false, 'result': null, 'message': null })
	const [data, setData] = useState({ 'is_loading': false, 'is_error': false, 'is_success': false, 'result': null, 'message': null })
	const { context,setContext } = useContext(MyContext);

	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
	  });

	  const handleChange = (event) => {
		setFormData({
		  ...formData,
		  [event.target.name]: event.target.value,
		});
	  };
	
	
	 const closeHandle=(id)=>{
        
        const config1={method:"get",headers: {"Content-Type": "application/json", "Authorization": true}}
        
        axiosApi(`ticket/api/close-ticket/${id}/`,config1,setCloseData,setContext);
        setId(id);
    }

	const navigate = useNavigate();
	useEffect(()=>{
		if(data.is_success)
		{
			toast.success("Record update successfully.")
			navigate("/home/")
		}
		

		const config = { method: "get", headers: { "Content-Type": "application/json", "Authorization": true } }
		if(!loadData.is_success)
		{
			axiosApi(`api/auth/users/me`, config, setLoadData, setContext);
		}
		else{
			setFormData({first_name:loadData.result.first_name ? loadData.result.first_name:'' ,last_name:loadData.result.last_name ? loadData.result.last_name : '',documents:loadData.result.documents ? loadData.result.documents :""});


		}
		
	


	},[loadData.is_success,data.is_success])

	const submitHandler = (e) => {
		e.preventDefault();
    	
		const config = { method: "put", headers: {"Content-Type": "application/json", "Authorization": true}, data:formData }
		axiosApi(`api/update/${uid}`, config, setData, setContext);

	};	

  return (
	<>
	{loadData.is_loading && <Spinner />}
	
	{loadData.is_success && <>
			<Title title="Update Profile" />
			<br/>
			<MDBContainer className="bg-white p-4"  style={{width:'350px',margin:"auto", borderRadius:"15px"}}>
			
							<h3 className="text-center">
								<FaSignInAlt /> Update Profile
							</h3>
							<hr className="hr-text" />
				<MDBRow className="mt-3">
					<MDBCol className="justify-content-center">
						<form onSubmit={submitHandler}>
							<img src={NoProfileImg} alt="Profile Pic" width="80px" height="80px" className="mb-3" style={{margin:'auto',display :'block'}} />
							<MDBInput  label='First Name' type='text' name='first_name' value={formData.first_name} onChange={handleChange} className="mb-3"/>
							<MDBInput  label='Last Name' type='text' name='last_name' value={formData.last_name} onChange={handleChange} className="mb-2"/>
							Select Document: {formData.documents ? <a href="">Download</a> :""}
							<MDBInput  type='file' name='documents'  className="mb-2"/>	
							<MDBBtn type="submit" color="dark" style={{backgroundColor: '#3d4a61' }} className="mt-3 w-100">Update</MDBBtn>
						</form>
					</MDBCol>
				</MDBRow>
			</MDBContainer></>}
		</>


  )
}

