import React, { useState, useContext } from 'react'
import { MDBInput, MDBBtn, MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import { axiosApi } from '../MyContext';
import { Spinner } from '..';
import { DownloadButton } from '..';
import { MyContext } from '../MyContext';
import { TextAreaRow } from './TextAreaRow';

export const ViewDocument = (props) => {
    const {setContext } = useContext(MyContext);

    const [data1, setData1] = useState({ 'is_loading': false, 'is_error': false, 'is_success': false, 'result': null, 'message': null })
    const [figures, setFigures] = useState(props.result.figures);
    const handleGetData = () => {
        const updatedData = JSON.stringify(figures);
        console.log(updatedData)
        const config = { method: "post", headers: { 'Content-Type': "application/json", "Authorization": true }, data: updatedData }
        axiosApi(`/api/alt-text-generator/save-data/`, config, setData1, setContext);

    };

    const cleardata =()=>{
        props.setData({ 'is_loading': false, 'is_error': false, 'is_success': false, 'result': null, 'message': null })

    }

        return (
            <>
                
                <h3 className="text-center">
                    Alt Text
                </h3>
                <hr className="hr-text" />
                {data1.is_loading && <Spinner />}

                <div className="card-body" style={{ maxHeight: '59vh', width:'100%', overflowY: 'auto', boxShadow: '2px 2px 1px grey' }}>

                    <table className="table" style={{width:"100%"}} >
                        <tbody>

                            {figures.map((figure) => (
                                <TextAreaRow key={figure.id} figure={figure} setFigures={setFigures} />
                            ))}


                        </tbody>
                    </table>


                </div>
                <MDBContainer>
                <MDBRow className='p-2'>
                    <MDBCol> <MDBBtn style={{ backgroundColor: '#3d4a61' }} className='text-white' onClick={handleGetData}>Save Data</MDBBtn>
                        <button className='mx-2 btn btn-outline-secondary' onClick={()=>{cleardata();}}>Back</button> {data1.result && <DownloadButton result={data1.result} />}</MDBCol><MDBCol></MDBCol></MDBRow>
                        </MDBContainer>
            </>

        )


}

