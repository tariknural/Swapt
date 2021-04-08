import axios from 'axios';
import authHeader from './auth-header';
import serviceConfig from "../config/service.config";

const API_URL = "http://" + serviceConfig.getHost() + ":" + serviceConfig.getPort() + "/api/comment/";

class CountryService {

  /**
   * Get list of all countries
   * @returns {Promise<AxiosResponse<any>>}
   */
  getAllCountryComments(countryId, currentInformation) {
    return axios.get(API_URL + countryId);
  }

  /**
   * Saves a comment
   * @returns {Promise<AxiosResponse<any>>}
   */
  saveComment(comment, predecessors, countryId, informationType){
    return axios.post(API_URL, {
      comment,
      predecessors,
      countryId,
      informationType
    }, {headers: authHeader()});
  }

}

export default new CountryService();
