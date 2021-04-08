import axios from "axios";
import authHeader from "./auth-header";
import serviceConfig from "../config/service.config";

const API_URL =
  "http://" +
  serviceConfig.getHost() +
  ":" +
  serviceConfig.getPort() +
  "/api/accommodation/filter";
const API_URL_CITY_COUNTRY = API_URL + "/user/destination/cc/";

class AccommodationFilterService {
  /**
   *
   * @param {*} parameters input fields for searching accommodation.
   */
  async getAccommodationListing(parameters) {
    return axios.post(API_URL, parameters, { headers: authHeader() });
  }


  async getUserDestinationCityAndCountry(parameters) {
    return axios.get(API_URL_CITY_COUNTRY + parameters.userId, { headers: authHeader() });
  }

}

export default new AccommodationFilterService();
