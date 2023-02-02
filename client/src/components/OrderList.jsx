import React, { useEffect, useContext, useReducer} from 'react'
import { Cart } from "../Cart";
import { useNavigate } from 'react-router-dom';

function OrderList() {
    const { state } = useContext(Cart);
    const { userInfo } = state;

    useEffect(()=>{

    }, []);

  return (
    <div>
      
    </div>
  )
}

export default OrderList
