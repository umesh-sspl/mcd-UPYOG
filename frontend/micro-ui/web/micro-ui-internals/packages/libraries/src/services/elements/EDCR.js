import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const EDCRService = {
  create: (data, tenantId) =>
    Request({
      url: Urls.edcr.create,
      // data: data,
      multipartData: data,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: { tenantId },
      auth: true,
      multipartFormData: true
    }),
    // Function to create an EDCR anonymously without requiring user authentication
    anonymousCreate: (data, tenantId) =>
      Request({
        url: Urls.edcr.anonymousCreate,
        // data: data,
        multipartData: data,
        useCache: false,
        setTimeParam: false,
        userService: true,
        method: "POST",
        params: { tenantId },
        auth: false,
        multipartFormData: true
      })
};