import axiosInstance from "../../services/axiosInstance";

export const salesOrderApi = {
  getById: (id) => axiosInstance.get(`/salesorders/${id}`).then((r) => r.data),
  create: (payload) => axiosInstance.post(`/salesorders`, payload).then((r) => r.data),
  update: (id, payload) => axiosInstance.put(`/salesorders/${id}`, payload).then((r) => r.data),
};

export const customerApi = {
  getAll: (search) =>
    axiosInstance.get(`/customers`, { params: { search } }).then((r) => r.data),
};

export const itemApi = {
  getAll: (search) =>
    axiosInstance.get(`/items`, { params: { search } }).then((r) => r.data),
  getByCode: (itemCode) =>
    axiosInstance.get(`/items/by-code/${encodeURIComponent(itemCode)}`).then((r) => r.data),
};
