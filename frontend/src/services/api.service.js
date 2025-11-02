import axios from "axios";

const ApiClient = (baseUrl) => {
  const apiClient = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("authenticateToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response?.status === 401 &&
        error.response?.data.message === "Token Expired"
      ) {
        localStorage.clear();
        window.location.href = "/user/login";
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};

export default ApiClient;
