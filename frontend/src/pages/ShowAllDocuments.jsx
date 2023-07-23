import React, {useEffect, useState,useContext } from 'react'
import { MyContext, axiosApi } from '..';

export const ShowAllDocuments = ({setData2}) => {
    const [data, setData] = useState({ 'is_loading': false, 'is_error': false, 'is_success': false, 'result': null, 'message': null })
    const  {context,setContext} = useContext(MyContext)


    const getAltText = (id) => {
        setData2({ 'is_loading': false, 'is_error': false, 'is_success': false, 'result': null, 'message': null })
        const config1 = { method: "get", headers: { "Content-Type": "application/json", "Authorization": true } }
        axiosApi(`/api/alt-text-generator/get-document/${id}`, config1, setData2, setContext);



    }

    useEffect(() => {

        const config = { method: "get", headers: { "Content-Type": "application/json", "Authorization": true } }
        axiosApi(`/api/alt-text-generator/get-documents/`, config, setData, setContext);

    }

        , [])





    return (<>
    <h3 className='text-center'>All Documents</h3>
    <hr className="hr-text" />
        <div style={{ marginTop:"5px", height: "71vh", verticalAlign: 'middle',overflowY:'scroll' }}>

            <table className="table" >
                <thead style={{borderBottom:"2px solid grey"}}>
                    <th style={{paddingLeft:'15px'}}>File Name</th><th style={{paddingLeft:'15px'}}>Date Created</th><th  style={{paddingLeft:'15px'}}>No of Figures</th><th  style={{paddingLeft:'15px'}}></th>
                </thead>
                <tbody>

                    {data.result && data.result.map((document) => (
                        <tr key={document.id}><td>{document.name}</td><td>{document.date_created}</td><td>{document.figures.length}</td><td><button className="btn btn-outline-primary" onClick={()=>getAltText(document.id)}>Alt Text</button></td></tr>
                    ))}


                </tbody>

            </table>


        </div></>
    )
}

