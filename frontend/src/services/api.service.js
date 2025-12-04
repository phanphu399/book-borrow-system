import axios from "axios";

const ApiClient = (baseUrl) => {
  const apiClient = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  // Truoc khi gui req (gan token vao header)
  apiClient.interceptors.request.use((config) => {
    const current = sessionStorage.getItem("currentLogin");
    const section = sessionStorage.getItem(current + "Section");
    const token = section ? JSON.parse(section).token : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // console.log(config.headers.Authorization);
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
