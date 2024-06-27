import axios from "axios";
import User from "./user";

class APICall {
  async postData(url, data) {
    try {
      const response = await axios.post(url, data);
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      if (error.response) {
        return {
          error: error.response.data || "Failed to post form data",
          status: error.response.status,
        };
      } else {
        console.error(error);
        return { error: "Failed to post form data", status: 500 };
      }
    }
  }

  async fetchData(url) {
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      if (error.response) {
        return {
          error: error.response.data || "Failed to post form data",
          status: error.response.status,
        };
      } else {
        console.error(error);
        return { error: "Failed to post form data", status: 500 };
      }
    }
  }

  async postFormData(url, data) {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      if (error.response) {
        return {
          error: error.response.data || "Failed to post form data",
          status: error.response.status,
        };
      } else {
        console.error(error);
        return { error: "Failed to post form data", status: 500 };
      }
    }
  }

  async postFormDataWithToken(url, data) {
    const token = User.getAccessToken();
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      if (error.response) {
        return {
          error: error.response.data || "Failed to post form data",
          status: error.response.status,
        };
      } else {
        console.error(error);
        return { error: "Failed to post form data", status: 500 };
      }
    }
  }

  async getDataWithToken(url) {
    const token = User.getAccessToken();
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      if (error.response) {
        return {
          error: error.response.data || "Failed to get data",
          status: error.response.status,
        };
      } else {
        console.error(error);
        return { error: "Failed to get data", status: 500 };
      }
    }
  }

  async deleteDataWithToken(url) {
    const token = User.getAccessToken();
    console.log(token);
    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200 || response.status === 204) {
        return { success: true };
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      if (error.response) {
        return {
          error: error.response.data || "Failed to delete data",
          status: error.response.status,
        };
      } else {
        console.error(error);
        return { error: "Failed to delete data", status: 500 };
      }
    }
  }

  async getUserById(url) {
    const token = User.getAccessToken();
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200 || response.status === 204) {
        return response;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      if (error.response) {
        return {
          error: error.response.data || "Failed to Fetch data",
          status: error.response.status,
        };
      } else {
        console.error(error);
        return { error: "Failed to Fetch data", status: 500 };
      }
    }
  }

  async updateFormDataWithToken(url, data) {
    const token = User.getAccessToken();
    console.log(token);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      if (error.response) {
        return {
          error: error.response.data || "Failed to post form data",
          status: error.response.status,
        };
      } else {
        console.error(error);
        return { error: "Failed to post form data", status: 500 };
      }
    }
  }

  async postDataWithTokn(url, data) {
    const token = User.getAccessToken();

    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      if (error.response) {
        return {
          error: error.response.data || "Failed to post form data",
          status: error.response.status,
        };
      } else {
        console.error(error);
        return { error: "Failed to post form data", status: 500 };
      }
    }
  }
}

export default APICall;
