import axios from "axios";
const API_URL = "http://localhost:8085/api/order/";

class OrderService {
    async addOrder(body) {
        const response = await axios.post(API_URL + `add`,body);
        return response;
    }
    async search(body){
        const response = await axios.post(API_URL+"search",body);
        return response.data;
    }
    async staticByWarehouse(ids) {
        const response = await axios.post(API_URL+"static-order-of-warehouse",ids);
        return response.data;
    }

    async staticBySeller() {
        const response = await axios.post(API_URL+"static-order-of-seller");
        return response.data;
    }

    
}
export default new OrderService();