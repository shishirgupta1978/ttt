import React from 'react';
import {MDBInput,MDBBtn,MDBCol,MDBContainer,  MDBRow} from "mdb-react-ui-kit";

export const  DownloadButton= (props)=> {


  const handleDownload = () => {
    const resultdata={}
    const customData =JSON.parse(props.result)
    let document_id=null
    let document_name=null

    if(customData.length>0)
    {
      document_id=customData[0]["document"]
      document_name=customData[0]["document_name"]
      
    }
   
      resultdata["document_id"]=document_id
      resultdata["document_name"]=document_name

    
    for (var i = 0; i < customData.length; i++){
      var obj = customData[i];
      if(obj["is_alt_text1_selected"]===true)
      {
        obj["alt_text"]=obj["alt_text1"]
      }
      else{
        obj["alt_text"]=obj["alt_text2"]
      }
      delete obj["id"]
      delete obj["alt_text1"]
      delete obj["alt_text2"]
      delete obj["is_alt_text1_selected"]
      delete obj["document"]
      delete obj["document_name"]
    }
    resultdata["figures"]=customData

    const json = JSON.stringify(resultdata, null, 4);

    const blob = new Blob([json], { type: 'application/json' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'custom_data.json';

    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button className="mx-2 btn btn-outline-primary" onClick={handleDownload}>Download JSON</button>
  );
}

