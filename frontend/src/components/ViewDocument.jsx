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
        const token = localStorage.getItem("Tokens") ? JSON.parse(localStorage.getItem("Tokens"))?.access : ''
        const config = { method: "post", headers: { 'Content-Type': "application/json", "Authorization": "Bearer " + token }, data: updatedData }
        axiosApi(`/api/alt-text-generator/save-data/`, config, setData1, setContext);

    };


        return (
            <div className="bg-light" style={{ width: '100%' }}>
                {data1.is_loading && <Spinner />}
                <h3 className="text-center">
                    Alt Text
                </h3>
                <hr className="hr-text" />

                <div className="card-body" style={{ maxHeight: '59vh', overflowY: 'auto', boxShadow: '3px 3px 2px grey' }}>

                    <table className="table" >
                        <tbody>

                            {figures.map((figure) => (
                                <TextAreaRow key={figure.id} figure={figure} setFigures={setFigures} />
                            ))}


                        </tbody>
                    </table>


                </div>
                <MDBRow className='p-2'>
                    <MDBCol>
                        <MDBBtn style={{ backgroundColor: '#3d4a61' }} className='text-white' onClick={handleGetData}>Save Data</MDBBtn></MDBCol><MDBCol> {data1.result && <DownloadButton result={data1.result} />}</MDBCol><MDBCol></MDBCol></MDBRow>
            </div>

        )


}

