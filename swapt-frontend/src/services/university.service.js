import axios from 'axios';
import authHeader from './auth-header';
import serviceConfig from "../config/service.config";

const API_URL = "http://" + serviceConfig.getHost() + ":" + serviceConfig.getPort() + "/api/university/";

class UniversityService {

  /**
   * Get list of all universities
   * @returns {Promise<AxiosResponse<any>>}
   */
  getAllUniversities() {
    return axios.get(API_URL,{ headers: authHeader() });
  }

  /**
   * Get a university by it's id
   * @param countryId
   * @returns {Promise<AxiosResponse<any>>}
   */
  getUniversityById(universityId) {
    return axios.get(API_URL + universityId, { headers: authHeader() });
  }

  /**
   * Get list of all universities in a country
   * @param countryId
   * @returns {Promise<AxiosResponse<any>>}
   */
  getAllUniversitiesByCountryId(countryId) {
    return axios.get(API_URL + "bycountry/" + countryId, { headers: authHeader() });
  }

  /**
   * Get list of all universities in a city
   * @param countryId
   * @returns {Promise<AxiosResponse<any>>}
   */
  getAllUniversitiesByCityId(cityId) {
    return axios.get(API_URL + "bycity/" + cityId, { headers: authHeader() });
  }

}

export default new UniversityService();
