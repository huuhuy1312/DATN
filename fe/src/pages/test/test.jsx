import React, { useState, useCallback } from "react";
import axios from "axios";


const Test = () =>{
  const thanhToan = async (amount,customer_id, new_water_index,invoiceId) => {
    try {
        const response = await axios.post(`http://127.0.0.1:8081/api/payment/create_payment/${amount *100}/${customer_id}/${new_water_index}/${invoiceId}`);
        console.log(response);
        const url = response.data.url;
        window.location.href = url; 
    } catch (error) {
        console.error(error);
        throw error;
    }
  }
  return(
    <div>
      <button className="btn-tt" onClick={()=>thanhToan(10000000,1, 1, 1)}>Thanh toán</button>
    </div>
    
  )
}
export default Test;