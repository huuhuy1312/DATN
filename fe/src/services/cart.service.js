import axios from "axios";
const API_URL = "http://localhost:8085/api/item/";

class CartService {
    async getByCustomerID(customer_id) {
        const response = await axios.get(API_URL + "cart-details?customer_id="+customer_id);
        return response.data;
    }
}
export default new CartService();