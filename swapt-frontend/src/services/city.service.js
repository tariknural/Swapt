import axios from 'axios';
import authHeader from './auth-header';
import serviceConfig from "../config/service.config";

const API_URL = "http://" + serviceConfig.getHost() + ":" + serviceConfig.getPort() + "/api/city/";

class CityService {

  /**
   * Get list of all cities
   * @returns {Promise<AxiosResponse<any>>}
   */
  getAllCities() {
    return axios.get(API_URL,{ headers: authHeader() });
  }

  /**
   * Get a country by it's id
   * @param countryId
   * @returns {Promise<AxiosResponse<any>>}
   */
  getCityById(cityId) {
    return axios.get(API_URL + cityId, { headers: authHeader() });
  }

  /**
   * Get list of all cities in a country
   * @param countryId
   * @returns {Promise<AxiosResponse<any>>}
   */
  getAllCitiesByCountryId(countryId) {
    return axios.get(API_URL + "bycountry/" + countryId, { headers: authHeader() });
  }

}

export default new CityService();
