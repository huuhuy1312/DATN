import axios from "axios";
const API_URL = "https://nominatim.openstreetmap.org/search?format=json&q=";

class NominatimService {
    async calcDistance(address1Lat, address1Lon, address2Lat ,address2Lon) {
        // const handleFormatAddress = (address) => {
        //     return address.replace(/ |,/g, '+')+"+Vietnam";
        // };
        // console.log(handleFormatAddress(address1))
        // console.log(handleFormatAddress(address2))
        // const response1 = await axios.get(API_URL + handleFormatAddress(address1));
        
        // const response2 = await axios.get(API_URL + handleFormatAddress(address2));

        // // // Check if responses are valid
        // if (response1.data.length === 0 || response2.data.length === 0) {
        //     throw new Error("One or both addresses could not be geocoded.");
        // }
        // const coords1 = response1.data[0];
        // const coords2 = response2.data[0];

        // const lat1 = parseFloat(coords1.lat);
        // const lon1 = parseFloat(coords1.lon);
        // const lat2 = parseFloat(coords2.lat);
        // const lon2 = parseFloat(coords2.lon);

        // Calculate distance using Haversine formula
        const distance =  this.getDistanceFromLatLonInKm(address1Lat, address1Lon, address2Lat, address2Lon);
        return distance;
    }

    

    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in km
        const dLat = this.degreesToRadians(lat2 - lat1);
        const dLon = this.degreesToRadians(lon2 - lon1);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        return R * c; // Distance in km
    }

    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
}

export default new NominatimService();