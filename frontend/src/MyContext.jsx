import React, { useState, createContext, useContext } from 'react';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import { toast } from "react-toastify";



export const BASE_URL = import.meta.env.VITE_BASE_URL && import.meta.env.VITE_BASE_URL != undefined ? import.meta.env.VITE_BASE_URL :"";

export const setuser =(token)=>{
localStorage.setItem("Tokens",token)
}

const msghandle =(error)=>{
  const message1 =
  (error.response &&
    error.response.data &&
    error.response.data.message) ||
  error.message ||
  error.toString();
  const message2 =
  (error.response &&
    error.response.data) 
    let n="";
    if(message2)
    {





      return JSON.stringify(message2)+" ("+message1+")";
    }
    else{
      return message1;
    }



}


export const removeUser=()=>{
  localStorage.removeItem("Tokens")
}

export const getAccessToken = ()=>{
  return localStorage.getItem("Tokens") ? JSON.parse(localStorage.getItem("Tokens")).access :null

}

export const getRefreshToken = ()=>{
  return localStorage.getItem("Tokens") ? JSON.parse(localStorage.getItem("Tokens")).refresh :null

}

export const getUser=()=>{
  return  localStorage.getItem("Tokens") ? jwt_decode(JSON.parse(localStorage.getItem("Tokens")).access) : null
}


export const MyContext = createContext();
export const MyProvider = (props) => {
  const [context, setContext] = useState({ 'user': getUser() });

  return (
    <MyContext.Provider value={{ context, setContext }}>
      {props.children}
    </MyContext.Provider>
  );
}
export const refresh=(setContext)=>{

  const rtoken = getRefreshToken()

  if (rtoken) {

    axios.post(`${BASE_URL}/api/token/refresh/`, { refresh: `${rtoken}` }).then((response) => {
      localStorage.setItem("Tokens", JSON.stringify({ refresh: `${rtoken}`, access: response.data.access }));
      setContext({user: getUser() })

    })
      .catch((error) => {
        const message =msghandle(error)
        console.log("error")

      })



  }






}





export const axiosApi = (url, config, setData, setContext) => {

  
  setData({ 'is_loading': true, 'is_error': false, 'is_success': false, 'result': null, 'message': null })
  refresh(setContext);
  const accessToken = getAccessToken()
  if (config.headers["Authorization"]) {
    config.headers["Authorization"] = "Bearer " + accessToken
  }
  axios(`${BASE_URL}/${url}`, config).then((response) => {
    setData({ 'is_loading': false, 'is_error': false, 'is_success': true, 'result': response.data, 'message': null }); console.log(response);


  })
    .catch((error) => {
      setData({ 'is_loading': false, 'is_error': true, 'is_success': false, 'result': null, 'message': error });
      
      const message=msghandle(error)

      if (error?.response?.status == 401) {
        removeUser();
        setContext({ 'user': null })
        toast.error( message);
      }
      else {
        toast.error(message);

      }



    })


}

