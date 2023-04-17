import SuperrAPI from "../lib/superr-api.connect.js";

var params = {
  "api_key": "XNmClGoyfAjyA1a2",
  "client_id": "ISH123",
  "password": "smc123456"
};

var superapi = new SuperrAPI(params);

(function () {
  try {
    console.log("Initiating Superr API")
    init();
  } catch (e) {
    console.error(e);
  }
})();

function init() {
  console.log(superapi.getLoginURL());
  console.log(superapi.getClientId());
  console.log(superapi.login());
}

