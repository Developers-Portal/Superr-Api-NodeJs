"use strict";

import axios from "axios";
import querystring from "querystring";
import routes from "./routes.js";

const SuperrAPI = function (params) {
  var defaults = {
    root: "https://uatauth.smcindiaonline.org",
    login: "https://uatauth.smcindiaonline.org/auth/login",
    debug: false,
    timeout: 7000,
  };

  // Params for SuperrAPI
  this.password = params.password;
  this.api_key = params.api_key;
  this.root = params.root || defaults.root;
  this.client_id = params.client_id || null;
  this.timeout = params.timeout || defaults.timeout;
  this.debug = params.debug || defaults.debug;
  this.access_token = params.access_token || null;
  this.session_expiry_hook = null;
  this.request_token = params.request_token || null;

  // Creating Axios instance
  const requestInstance = axios.create({
    baseURL: this.root,
    timeout: this.timeout,
  });

  // Add a request interceptor
  requestInstance.interceptors.request.use(function (request) {
    // if (this.debug)
    console.log(request);
    return request;
  });

  // Add a response interceptor
  requestInstance.interceptors.response.use(
    function (response) {
      // if (this.debug) console.log(response);

      const contentType = response.headers["content-type"];
      if (
        contentType === "application/json" &&
        typeof response.data === "object"
      ) {
        if (response.data.error_type) throw response.data;
        return response.data.data;
      } else if (contentType === "text/csv") {
        return response.data;
      } else {
        return {
          error_type: "DataException",
          message:
            "Unknown content type (" +
            contentType +
            ") with response: (" +
            response.data +
            ")",
        };
      }
    },
    function (error) {
      let resp = {
        message: "Unknown error",
        error_type: "GeneralException",
        data: null,
      };

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data && error.response.data.error_type) {
          if (
            error.response.data.error_type === "TokenException" &&
            this.session_expiry_hook
          ) {
            this.session_expiry_hook();
          }

          resp = error.response.data;
        } else {
          resp.error_type = "NetworkException";
          resp.message = error.response.statusText;
        }
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        resp.error_type = "NetworkException";
        resp.message = "No response from server with error code: " + error.code;
      } else if (error.message) {
        resp = error;
      }
      return Promise.reject(resp);
    }
  );

  // Get the Login URL with apikey
  this.getLoginURL = function (api_key) {
    return defaults.login + `?api-key=` + this.api_key;
  };

  // Get Client ID
  this.getClientId = function (client_id) {
    return this.client_id;
  };

  //Setting Request Token
  this.setRequestToken = function (request_token) {
    return (this.request_token = request_token);
  };

  //Login with API key
  this.login = function (password) {
    let params = {
      platform: "api",
      data: {
        client_id: "ish123",
        password: "smc123456",
      },
    };
    let token_data = _post("user.login", params);

    token_data
      .then((response) => {
        if (response) {
          console.log(response.data);
          this.request_token(response.data.request_token);
        }
      })
      .catch(function (err) {
        console.log(err);
        throw err;
      });
    return token_data;
  };

  // Request Handlers
  function _get(
    route,
    params,
    responseType,
    responseTransformer,
    isJSON = false
  ) {
    return request(
      route,
      "GET",
      params || {},
      responseType,
      responseTransformer,
      isJSON
    );
  }

  function _post(
    route,
    params,
    responseType,
    responseTransformer,
    isJSON = false,
    queryParams = null
  ) {
    return request(
      route,
      "POST",
      params || {},
      responseType,
      responseTransformer,
      isJSON,
      queryParams
    );
  }

  function _put(
    route,
    params,
    responseType,
    responseTransformer,
    isJSON = false,
    queryParams = null
  ) {
    return request(
      route,
      "PUT",
      params || {},
      responseType,
      responseTransformer,
      isJSON,
      queryParams
    );
  }

  function _delete(
    route,
    params,
    responseType,
    responseTransformer,
    isJSON = false
  ) {
    return request(
      route,
      "DELETE",
      params || {},
      responseType,
      responseTransformer,
      isJSON
    );
  }

  function request(
    route,
    method,
    params,
    responseType,
    responseTransformer,
    isJSON,
    queryParams
  ) {
    // Check access token
    if (!responseType) responseType = "json";
    let uri = routes[route];

    // Replace variables in "RESTful" URLs with corresponding params
    if (uri.indexOf("{") !== -1) {
      let k;
      for (k in params) {
        if (params.hasOwnProperty(k)) {
          uri = uri.replace("{" + k + "}", params[k]);
        }
      }
    }

    let payload = null;
    if (method === "GET" || method === "DELETE") {
      queryParams = params;
    } else {
      if (isJSON) {
        // post JSON payload
        payload = JSON.stringify(params);
      } else {
        // post url encoded payload
        payload = querystring.stringify(params);
      }
    }

    const options = {
      method: method,
      url: uri,
      params: queryParams,
      data: payload,
      // Set auth header
      headers: {},
    };

    // Send auth token
    // if (this.access_token) {
    //     const authHeader = this.api_key + ":" + this.access_token;
    //     options["headers"]["Authorization"] = "token " + authHeader;
    // }

    // Set request header content type
    if (isJSON) {
      options["headers"]["Content-Type"] = "application/json";
    } else {
      options["headers"]["Content-Type"] = "application/x-www-form-urlencoded";
    }
    // Set response transformer
    // if (responseTransformer) {
    //     options.transformResponse = axios.defaults.transformResponse.concat(responseTransformer);
    // }

    return requestInstance.request(options);
  }
};

export default SuperrAPI;
