const superrConnectRoutes = {
  //User/Login APIs
  "user.login": "/auth/login",
  "user.2FAVerify": "/auth/twofa/verify",
  "api.token": "/auth/token",

  //Order Service APIs
  "order.place": "/order/v1/place-order",
  "order.modify": "/order/v1/modify-order",
  "order.cancel": "/order/v1/cancel-order",

  //Report Service APIs
  "report.user_details": "/report/v1/getUserDetails",
  "report.order_book": "/report/v1/order-book",
  "report.trade_book": "/report/v1/trade-book",
  "report.script_master": "/report/v1/script-master",

  //Portfolio Service APIs
  "portfolio.holdings": "/portfolio/v1/holding",
  "portfolio.position": "/portfolio/v1/position",
  "portfolio.position_conversion": "/portfolio/v1/position-conversion",

  //Fund Service APIs
  "fund.funds_details": "/fund/v1/fund-details",
};

export default superrConnectRoutes;
