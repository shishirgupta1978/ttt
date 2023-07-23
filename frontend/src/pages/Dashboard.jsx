import React, { useState } from 'react';
import { Sidebar } from '../components';
import { Spinner } from '../components';
import {PiToggleLeftFill} from 'react-icons/pi'
import { ViewDocument } from '../components';
import { ShowAllDocuments } from './ShowAllDocuments';

export const Dashboard = (props) => {
    const [isOpen, setIsOpen] = useState(true);
    const [docxFile, setDocxFile] = useState(null);
    

    const [data, setData] = useState({ 'is_loading': false, 'is_error': false, 'is_success': false, 'result': null, 'message': null })

    const toggleSidebar = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <>
        <Sidebar isOpen={isOpen} toggle={toggleSidebar} setData={setData} setDocxFile={setDocxFile} />
        <div className="dashboard-content bg-light" >
        {data.result == null  && data.is_loading == false && <ShowAllDocuments  setData2={setData}/>}
        {data.is_loading && <Spinner />}    
        {data.is_loading && <div style={{height:"80vh",verticalAlign: 'middle'}}><h1 className='text-center'>Please Wait</h1></div>}{data.is_success && data.result && <ViewDocument result={data.result} data={data} setData={setData} />}
          <button className="toggle-button"  onClick={toggleSidebar}>
          <PiToggleLeftFill style={{color:'#3d4a61'}} size={60}  />
          </button>
        </div>
      </>
    );
  };