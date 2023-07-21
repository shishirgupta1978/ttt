import React from 'react';
import {MDBInput,MDBBtn,MDBCol,MDBContainer,  MDBRow} from "mdb-react-ui-kit";

export const  DownloadButton= (props)=> {


  const handleDownload = () => {
    // Create your custom JSON data
    const customData =JSON.parse(props.result)
    const customData1 = {
      name: 'John Doe',
      age: 30,
      email: 'johndoe@example.com',
    };

    // Convert the JSON data to a string
    const json = JSON.stringify(customData, null, 4);

    // Create a blob from the JSON string
    const blob = new Blob([json], { type: 'application/json' });

    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a download link element
    const link = document.createElement('a');
    link.href = url;
    link.download = 'custom_data.json';

    // Programmatically click the download link
    link.click();

    // Clean up the temporary URL
    URL.revokeObjectURL(url);
  };

  return (
    <button className="btn btn-outline-primary" onClick={handleDownload}>Download JSON</button>
  );
}

