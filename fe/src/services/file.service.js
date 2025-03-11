import axios from "axios";
const API_URL = "http://localhost:8081/file/";

class FileService {
    async readImage(fileName) {
        const response = await axios.get(API_URL + `read-image/${fileName}`);
        console.log(API_URL + `read-image/${fileName}`)
        console.log(response)
        return response.data;
    }

}
export default new FileService();