import axios from "axios";
const API_URL = "http://localhost:8083/api/rate";

class RatesService {
    async addRate(body){
        const response = await axios.post(API_URL+"/add",body,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        console.log(response);
        return response;
    }
    async getByProductId(productId){
        const response =await axios.get(API_URL+"/filter-by-product-id?idProduct=" +productId)
        return response.data;
    }
}
export default new RatesService();