import axios from "axios";
const API_URL = "http://localhost:8086/api/message";

class FileService {
    async findPartnerBySender(user) {
        const url = API_URL + `/partners-with-unread-count?user=${user}`
        console.log(url)
        const response = await axios.get(url);
        return response.data;
    }
    async findMessage(user,partner) {
        const url = API_URL + `/chat-with-partner?user=${user}&partner=${partner}`;
        console.log(url)
        const response = await axios.get(url);
        console.log(response)
        return response.data;
    }
    async updateStatus(user,partner){
        const url =  API_URL + `/update-status?user=${user}&partner=${partner}`;
        const response = await axios.post(url);
        return response.data;
    }

}
export default new FileService();