import axios from "axios";
import User from "./user";
import { useRouter } from 'next/navigation'; // For app directory routing


class APICall {
  constructor() {
   this.router = useRouter();
  }
  async makeRequest(
    method,
    url,
    data = null,
    useToken = false,
    isFormData = false
  ) {
    const config = {
      method,
      url,
      headers: {},
    };

    if (useToken) {
      const token = User.getAccessToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      if (isFormData) {
        const formData = new FormData();
        Object.keys(data).forEach((key) => formData.append(key, data[key]));
        config.data = formData;
        config.headers["Content-Type"] = "multipart/form-data";
      } else {
        config.data = data;
      }
    }

    try {
      const response = await axios(config);
      if (response.status === 200 || response.status === 204) {
        return response.data;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          User.logout();
          if (typeof window !== 'undefined') {
            this.router.push('/');;
          }

          // Return an error object
          return { 
            error: 'Unauthorized. Please log in again.', 
            status: 401 
          };
        }

        // Handle other error responses
        return {
          error: error.response.data || `Failed to ${method} data`,
          status: error.response.status,
        };
      } else {
        return { error: `Failed to ${method} data`, status: 500 };
      }
    }
  }

  async postData(url, data) {
    return this.makeRequest("post", url, data);
  }

  async fetchData(url) {
    return this.makeRequest("get", url);
  }

  async postFormData(url, data) {
    return this.makeRequest("post", url, data, false, true);
  }

  async postFormDataWithToken(url, data) { 
    return this.makeRequest("post", url, data, true, true);
  }

  async postDataToken(url, data) {
    return this.makeRequest("post", url, data, true, false);
  }


  async getDataWithToken(url) {
    return this.makeRequest("get", url, null, true);
  }

  async deleteDataWithToken(url) {
    return this.makeRequest("delete", url, null, true);
  }

  async getUserById(url) {
    return this.makeRequest("get", url, null, true);
  }

  async updateFormDataWithToken(url, data) {
    return this.makeRequest("post", url, data, true, true);
  }

  async postDataWithTokn(url, data) {
    return this.makeRequest("post", url, data, true, false);
  }
}

export default APICall;
