import React,{useState,useEffect,useContext} from 'react'
import { axiosApi,MyContext } from '../MyContext';
import { toast } from 'react-toastify';
import {MDBInput,MDBBtn,MDBCol,MDBContainer,  MDBRow} from "mdb-react-ui-kit";
import { ViewDocument } from '../components';
import { Spinner } from '../components';
import { useNavigate } from "react-router-dom";


export const Dashboard1 = () => {
  const { context,setContext } = useContext(MyContext);

	const [data, setData] = useState({ 'is_loading': false, 'is_error': false, 'is_success': false, 'result': null, 'message': null })
	const [source1, setSource1] = useState(null);
  

    const handleSource1Change = (event) => {
      setSource1(event.target.files[0]);
      };
 
  
	const submitHandler1 = (e) => {
		e.preventDefault();
    const mformData = new FormData();
    if(source1 )
    {
    mformData.append("source", source1);
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
    <MDBContainer  className="bg-white p-4" style={{maxHeight:'82vh'}}>
      <h3 className="text-center" >
								 Alt Text Generator
							</h3>
							<hr className="hr-text" />
              
              {data.is_loading && <Spinner />}
              

          


               <MDBRow className="mt-3">
                <MDBCol size="4" style={{borderRight:'.1px solid grey'}}>       
                
                <MDBContainer className="bg-white p-4"  style={{width:'350px',margin:"auto", borderRadius:"15px"}}>
			
<MDBRow className="mt-3">
  <MDBCol className="justify-content-center">
                
  <form onSubmit={submitHandler1}>
                <h5>Select Docx file</h5>        
                <MDBRow><MDBCol size="8">
      
  <MDBInput name='source1' type="file"  accept=".docx" onChange={handleSource1Change} required /></MDBCol>
  <MDBCol size="4">
  <MDBBtn  style={{backgroundColor: '#3d4a61' }}  className='text-white' type="submit">Upload</MDBBtn></MDBCol>
  </MDBRow>
</form>
  </MDBCol>
</MDBRow>
</MDBContainer>
                
                
    
</MDBCol><MDBCol size="8">{data.is_loading && <p>Please Wait</p>}{data.is_success  && <ViewDocument result={data.result} />}</MDBCol>
				</MDBRow>
    </MDBContainer>
  )
}

