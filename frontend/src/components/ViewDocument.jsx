import React,{useState,useContext} from 'react'
import { NavLink } from 'react-router-dom';
import {MDBInput,MDBBtn,MDBCol,MDBContainer,  MDBRow} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { axiosApi } from '../MyContext';
import { Spinner } from '..';
import { DownloadButton } from '..';
import { MyContext } from '../MyContext';
import {TextAreaRow} from './TextAreaRow';

export const ViewDocument = (props) => {
  const { context,setContext } = useContext(MyContext);

  const [data1, setData1] = useState({ 'is_loading': false, 'is_error': false, 'is_success': false, 'result': null, 'message': null })
    const [figures, setFigures] = useState(props.result.figures);
    const handleGetData = () => {
        const updatedData = JSON.stringify(figures);
        console.log(updatedData)
        const token=localStorage.getItem("Tokens") ? JSON.parse(localStorage.getItem("Tokens"))?.access :''
			const config = { method: "post", headers: { 'Content-Type': "application/json", "Authorization": "Bearer " + token  }, data:updatedData }
			axiosApi(`/api/alt-text-generator/save-data/`, config, setData1,setContext);

      };
      


  
  


    if(props.result.type==="Docx")
    {
        return (
            <div className="card mx-auto py-3" style={{width: '100%'}}>
              {data1.is_loading && <Spinner />}
    <div   className="card-body"  style={{maxHeight:'60vh', overflowY:'auto'}}>
        <table className="table" >
            <tbody>
            
            {figures.map((figure) => (
          <TextAreaRow key={figure.id} figure={figure} setFigures={setFigures} />
          ))}


            </tbody>
        </table>
            

    </div>
    <MDBRow className='mt-2'>
      <MDBCol>
    <MDBBtn style={{backgroundColor: '#3d4a61' }} className='text-white' onClick={handleGetData}>Save Data</MDBBtn></MDBCol><MDBCol> {data1.result && <DownloadButton result={data1.result}/>}</MDBCol><MDBCol></MDBCol></MDBRow>
</div>
      
        )

    }
    else if(props.result.type==="Image")
    {
        return (
            <div>
                <img height="400px" width="100%" src={import.meta.env.VITE_BASE_URL+props.result.source}/>
                {import.meta.env.VITE_BASE_URL+props.result.source}
            </div>

        )

    }
    else{
        return (
            <div>
            {props.result.type}
            </div>
      

        )

    }

}

