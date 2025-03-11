import axios from "axios";
const API_URL = "http://localhost:8085/api/payment/";

class PaymentService {
    async submitOrder(body) {
        const response = await axios.post(API_URL + `submitOrder`,body);
        return response;
    }
    async addPayment(body){
        const response = await axios.post(API_URL+"add",body)
        return response;
    }

    async all(){
        const response = await axios.get(API_URL+"all")
        return response.data;
    }
    

    
}
export default new PaymentService();