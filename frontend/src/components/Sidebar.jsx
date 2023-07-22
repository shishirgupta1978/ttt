import {PiToggleRightFill} from 'react-icons/pi'
import React,{useState,useEffect,useContext} from 'react'
import { axiosApi,MyContext } from '../MyContext';
import { toast } from 'react-toastify';
import {MDBInput,MDBBtn,MDBCol,MDBContainer,  MDBRow} from "mdb-react-ui-kit";
import { ViewDocument } from '../components';
import { Spinner } from '../components';



export const Sidebar = ({ isOpen, toggle, setData }) => {
    const { context,setContext } = useContext(MyContext);

	
	const [source, setSource] = useState(null);
  

    const handleSourceChange = (event) => {
      setSource(event.target.files[0]);
      };
 
  
	const submitHandler = (e) => {
		e.preventDefault();
    const mformData = new FormData();
    if(source )
    {
    mformData.append("source", source);
    mformData.append("type", "Docx");
    const token=localStorage.getItem("Tokens") ? JSON.parse(localStorage.getItem("Tokens"))?.access :''
			const config = { method: "post", headers: { 'Content-Type': 'multipart/form-data', "Authorization": "Bearer " + token  }, data:mformData }
			axiosApi(`/api/alt-text-generator/upload-document/`, config, setData,setContext);
    }
    else{
      toast.error("Error!, Please submit Again.")
    }
	
	};



  





  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="toggle-button" onClick={toggle}>
        <PiToggleRightFill style={{color:'#3d4a61'}} size={60}  />
      </button>
      <div className="sidebar-menu">
      <MDBContainer className="p-4"  style={{width:'350px',margin:"auto", borderRadius:"15px"}}>
			
            <MDBRow className="mt-3">
              <MDBCol className="justify-content-center">
                            
              <form onSubmit={submitHandler}>
                            <MDBRow>
                  
              <MDBInput name='source' type="file"  accept=".docx" onChange={handleSourceChange} required /></MDBRow>
              <MDBRow>
              <MDBBtn  style={{backgroundColor: '#3d4a61' }}  className='text-white mt-3' type="submit">Get Alt Text</MDBBtn>
              </MDBRow>
            </form>
              </MDBCol>
            </MDBRow>
            </MDBContainer>
            
      </div>
    </div>
  );
};

