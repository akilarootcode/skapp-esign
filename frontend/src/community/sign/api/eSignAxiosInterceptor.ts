import axios, { InternalAxiosRequestConfig } from "axios";

import { ApiVersions } from "~community/common/constants/configs";
import { tenantID } from "~community/common/utils/axiosInterceptor";
import { getApiUrl } from "~community/common/utils/getConstants";

export const createExternalSigningDocumentAuthAxios = (token: string) => {
  const eSignAxios = axios.create({
    baseURL: getApiUrl() + ApiVersions.V1
  });

  eSignAxios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      config.headers.Authorization = `Bearer ${token}`;

      if (tenantID) {
        config.headers["X-Tenant-ID"] = tenantID;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  eSignAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return eSignAxios;
};
