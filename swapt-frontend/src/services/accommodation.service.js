import axios from 'axios';
import authHeader from './auth-header';
import serviceConfig from "../config/service.config";

const API_URL = "http://" + serviceConfig.getHost() + ":" + serviceConfig.getPort() + "/api/accommodation/";

class AccommodationService {

  /**
   * Get Accommodation list for current active user.
   * @returns {Promise<AxiosResponse<any>>}
   */
  getAccommodationList() {
    return axios.get(API_URL+ "foruser/",{ headers: authHeader() });
  }

  getAccommodation(accommodationId) {
    return axios.get(API_URL+accommodationId,{ headers: authHeader() });
  }

  getUserAccommodation() {
    return axios.get(API_URL+'useraccommodation/',{ headers: authHeader() });
  }

  getAccommodationByUserId(userId) {
    return axios.get(API_URL+'user/'+userId,{ headers: authHeader() });
  }

  addAccommodation(accommodationData) {
    return axios
        .post(API_URL + "add", accommodationData,{headers: authHeader()})
        .then(response => {
          return response;
        });
  }

  updateAccommodation(accommodationData) {
    return axios
        .post(API_URL + "update", accommodationData,{headers: authHeader()})
        .then(response => {
          return response;
        });
  }

  uploadAccommodationVerificationFile(formData) {
    return axios.post(API_URL + "uploadverification", formData, {headers: authHeader()}).then(response => {
      return response;
    });
  }


}

export default new AccommodationService();
