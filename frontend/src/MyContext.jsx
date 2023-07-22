import React, { useState, createContext, useContext } from 'react';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import { toast } from "react-toastify";



const BASE_URL = import.meta.env.VITE_BASE_URL;

export const MyContext = createContext();
export const MyProvider = (props) => {
  const [context, setContext] = useState({ 'user': localStorage.getItem("Tokens") ? jwt_decode(JSON.parse(localStorage.getItem("Tokens"))?.access) : null });

  return (
    <MyContext.Provider value={{ context, setContext }}>
      {props.children}
    </MyContext.Provider>
  );
}






export const axiosApi = (url, config, setData, setContext) => {


  setData({ 'is_loading': true, 'is_error': false, 'is_success': false, 'result': null, 'message': null })
  setContext({ 'user': localStorage.getItem("Tokens") ? jwt_decode(JSON.parse(localStorage.getItem("Tokens"))?.access) : null })




  const token = localStorage.getItem("Tokens") ? JSON.parse(localStorage.getItem("Tokens"))?.access : null


  if (config.headers["Authorization"]) {
    config.headers["Authorization"] = "Bearer " + token
  }

  axios(`${BASE_URL}/${url}`, config).then((response) => {
    setData({ 'is_loading': false, 'is_error': false, 'is_success': true, 'result': response.data, 'message': null }); console.log(response);
    const rtoken = localStorage.getItem("Tokens") ? JSON.parse(localStorage.getItem("Tokens"))?.refresh : null

    if (rtoken) {

      axios.post(`${BASE_URL}/api/token/refresh/`, { refresh: `${rtoken}` }).then((response) => {
        localStorage.setItem("Tokens", JSON.stringify({ refresh: `${rtoken}`, access: response.data.access }));
        setContext({user: localStorage.getItem("Tokens") ? jwt_decode(JSON.parse(localStorage.getItem("Tokens"))?.access) : null })

      })
        .catch((error) => {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          localStorage.removeItem("Tokens");
          setContext({ 'user': null })

        })



    }



  })
    .catch((error) => {
      setData({ 'is_loading': false, 'is_error': true, 'is_success': false, 'result': null, 'message': error });
      console.log(error);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      if (error?.response?.status == 401) {
        localStorage.removeItem("Tokens");
        setContext({ 'user': null })
        toast.error("Session Expired or Unauthorised\n" + message);
      }
      else {
        toast.error(message);

      }



    })


}

