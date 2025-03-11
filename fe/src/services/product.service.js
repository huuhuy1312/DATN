import axios from "axios";
const API_URL = "http://localhost:8083/api/product/";

class ProductService {
    async getAllProduct() {
        const response = await axios.get(API_URL + "all");
        console.log(response.data)
        return response.data;
    }
    async getProductByName(name) {
        const response = await axios.get(API_URL + `search?keyword=${name}`);
        return response.data;
    }
    async getProductById(id) {
        const response = await axios.get(API_URL + `${id}`);
        return response.data;
    }
    async findBySellerId(sellerId){
        const response = await axios.get(API_URL+`find-by-seller-id?sellerId=${sellerId}`)
        return response.data;
    }
    async findByCondition(body){
        const response = await axios.post(API_URL + "find-by-condition",body);
        return response.data;
    }

    async search(body){
        const response = await axios.post(API_URL + "search",body);
        return response.data;
    }
    async deleteByIds(ids){
        const response = await axios.post(API_URL+"delete-by-ids",ids)
        return response.data;
    }
    async staticBySeller(){
        const response = await axios.get(API_URL+"static-by-seller")
        return response.data;
    }
    async getSuggestProduct(pid){
        const response = await axios.get(API_URL+ `suggest?pid=${pid}`);
        return response.data;
    }
    async getSuggestCF(uid){
        const response = await axios.get(API_URL+ `suggest-cf?userId=${uid}`);
        return response.data;
    }
}
export default new ProductService();