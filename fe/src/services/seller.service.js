import axios from "axios";

const API_URL = "http://localhost:8080/api/seller";
class SellerService{
    async add(body) {
        try {
            const response = await axios.post(API_URL + "/add", body, {
                headers: {
                    'Content-Type': 'multipart/form-data',  
                },
            });
            return response;
        } catch (error) {
            console.error("Error adding seller:", error);
            throw error;
        }
    }
    async findByAccountId(account_id){
        try{
            const response = await axios.get(API_URL +`/findByAccountId?account_id=${account_id}`)

            return response.data.data;
        }catch (error) {
            console.error("Error find seller:", error);
            throw error;
        }
    }

    async search(body)
    {
        const response = await axios.post(API_URL + "/search",body);
        return response.data;
    }
    async findAll()
    {
        const response = await axios.get(API_URL + "/findAll");
        return response;
    }
    async findById(id)
    {
        const response = await axios.get(API_URL + "/find-by-id?id="+id)
        return response;
    }
    async rejectRequest(body)
    {
        const response = await axios.post(API_URL+"/reject-request",body)
        return response.data;

    }
    async acceptRequest(id)
    {
        const response = await axios.post(API_URL+"/accept-request?id="+id);
        return response.data;
    }
    async staticSeller()
    {
        const response = await axios.get(API_URL + "/static-seller");
        return response.data;
    }
    async updateSeller(body)
    {
        const response = await axios.post(API_URL+"/update",body)
        return response.data;
    }
}
export default new SellerService();