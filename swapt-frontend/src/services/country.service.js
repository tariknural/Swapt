import axios from 'axios';
import authHeader from './auth-header';
import serviceConfig from "../config/service.config";

const API_URL = "http://" + serviceConfig.getHost() + ":" + serviceConfig.getPort() + "/api/country/";

class CountryService {

  /**
   * Get list of all countries
   * @returns {Promise<AxiosResponse<any>>}
   */
  getAllCountries() {
    return axios.get(API_URL,{ headers: authHeader() });
  }

  /**
   * Get a country by it's id
   * @param countryId
   * @returns {Promise<AxiosResponse<any>>}
   */
  getCountryById(countryId) {
    return axios.get(API_URL + countryId, { headers: authHeader() });
  }

}

export default new CountryService();
