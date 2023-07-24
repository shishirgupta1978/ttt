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
	const [selectedImage, setSelectedImage] = useState(null);
	const [profileUrl, setProfileUrl] = useState(null);
	const [documentUrl, setDocumentUrl] = useState(null);
	const [selectedDocument, setSelectedDocument]=useState(null);

	const handleImageClick = () => {
	  fileInputRef.current.click();
	};
  
	const handleFileChange = (event) => {
	  const file = event.target.files[0];

	  setSelectedImage(file);
	  setProfileUrl(URL.createObjectURL(event.target.files[0]))


	  
	};

	const handleDocumentChange = (event) => {
		const document = event.target.files[0];
  
		setSelectedDocument(document);
		
  
  
		
	  };
  
	const fileInputRef = React.createRef();


  
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
	
	

	const navigate = useNavigate();
	useEffect(()=>{
		if(data.is_success)
		{
			toast.success("Record update successfully.")
			navigate("/")
		}
		

		const config = { method: "get", headers: { "Content-Type": "application/json", "Authorization": true } }
		if(!loadData.is_success)
		{
			axiosApi(`api/auth/users/me`, config, setLoadData, setContext);
		}
		else{
			
			setFormData({...formData, first_name:loadData.result.first_name ? loadData.result.first_name:'' ,last_name:loadData.result.last_name ? loadData.result.last_name : ''});

			setDocumentUrl(loadData.result.documents);
		    setProfileUrl(loadData.result.profile_pic);

			


		}
		
	


	},[loadData.is_success,data.is_success])

	const submitHandler = (e) => {
		e.preventDefault();
		const myformData = new FormData();
		if(selectedDocument)
		{
			myformData.append("documents", selectedDocument);
		}
		if(selectedImage)
		{
			myformData.append("profile_pic", selectedImage);

		}
			myformData.append("first_name", formData.first_name);
			myformData.append("last_name", formData.last_name);

			const config = { method: "post", headers: { 'Content-Type': 'multipart/form-data', "Authorization": true }, data:myformData }
			axiosApi(`api/auth/user-update/`, config, setData,setContext);
		

		
    	

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

						<img
        src={profileUrl ? profileUrl : NoProfileImg}
        alt="Click to Upload"
        onClick={handleImageClick}
		width="80px" height="80px" className="mb-3" style={{margin:'auto',borderRadius: '50%', display :'block',cursor: 'pointer'}}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
    



							
							<MDBInput  label='First Name' type='text' name='first_name' value={formData.first_name} onChange={handleChange} className="mb-3"/>
							<MDBInput  label='Last Name' type='text' name='last_name' value={formData.last_name} onChange={handleChange} className="mb-2"/>
							Update Documents if any: {documentUrl ? <a href={documentUrl}>Download</a> :""}
							<MDBInput  type='file' name='documents' accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed" onChange={handleDocumentChange} className="mb-2"/>	
							<MDBBtn type="submit" style={{backgroundColor: '#3d4a61' }} className="mt-3 w-100">Update</MDBBtn>
						</form>
					</MDBCol>
				</MDBRow>
			</MDBContainer></>}
		</>


  )
}

