import axios from "axios";
const API_URL = "http://localhost:8085/api/shipping-methods/";

class ShippingMethodsService {
    async getAll(){
        const response = await axios.get(API_URL+"all");
        return response.data;
    }
}
export default new ShippingMethodsService();