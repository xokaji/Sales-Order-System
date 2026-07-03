import axiosInstance from "../../services/axiosInstance";


export const homeApi = {
  getList: ({ pageNumber = 1, pageSize = 20, sortBy, descending = true }) =>
    axiosInstance
      .get(`/salesorders`, { params: { pageNumber, pageSize, sortBy, descending } })
      .then((r) => r.data),
};
