import React, { useReducer, useContext, useEffect, useState} from 'react'
import { Cart } from '../Cart';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import errorMessage from './error';

const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return {
          ...state,loading: false };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
          case 'UPDATE_SUCCESS':
            return {
              ...state,loadingUpdate: false };
          case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false };
      default:
        return state;
    }
  };


function UserEdit() {
    const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
      });
      const { state } = useContext(Cart);
      const { userInfo } = state;

      const params= useParams();
      const { id: userId }= params;

      const navigate= useNavigate();
      const [name, setName]= useState('');
      const [email, setEmail]= useState('');
      const [admin, setAdmin]= useState(false);

      useEffect(()=>{
        const fetchData=async()=>{
            try{
                dispatch({type: 'FETCH_REQUEST'});
                const { data } = await axios.get(`/api/order/${userId}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                  });
                  setName(data.name);
                  setEmail(data.email);
                  setAdmin(data.admin);
                  dispatch({type: 'FETCH_SUCCESS'});

            }catch (err){
                dispatch({type: 'FETCH_FAIL',
            payload:errorMessage(err)})
            }

        };
        fetchData();
      },[userId, userInfo])
const submitHandler = async(e)=>{
    e.preventDefault();
    try{
        dispatch({type: 'UPDATE_REQUEST'});

    }catch(error){
        alert(errorMessage(error));
        dispatch({type: 'UPDATE_FAIL'});
    }
}
  return (
    <div>
      
    </div>
  )
}

export default UserEdit
