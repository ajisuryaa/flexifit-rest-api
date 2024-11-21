const globalRouter = require('express').Router();
const { apiPath } = require('../tools/api_path');

const accountRoute = require('./accounts/route');
const authRoute = require('./authentications/route');
const venueRoute = require('./venues/route');
const membershipRoute = require('./memberships/route');

globalRouter.use(
    apiPath(process.env.API_VERSION, accountRoute.name), 
    accountRoute.router
);

globalRouter.use(
    apiPath(process.env.API_VERSION, authRoute.name), 
    authRoute.router
);

globalRouter.use(
    apiPath(process.env.API_VERSION, venueRoute.name), 
    venueRoute.router
);

globalRouter.use(
    apiPath(process.env.API_VERSION, membershipRoute.name), 
    membershipRoute.router
);

// const authenticationRoute = require('./authentications/route');
// globalRouter.use(
//     apiPath(process.env.API_VERSION, authenticationRoute.name), 
//     authenticationRoute.router
// );

// const dashboardRoute = require('./dashboards/route');
// globalRouter.use(
//     apiPath(process.env.API_VERSION, dashboardRoute.name), 
//     dashboardRoute.router
// );

// const registrationRoute = require('./registrations/route');
// globalRouter.use(
//     apiPath(process.env.API_VERSION, registrationRoute.name), 
//     registrationRoute.router
// );

// const userRoute = require('./users/route');
// globalRouter.use(
//     apiPath(process.env.API_VERSION, userRoute.name), 
//     userRoute.router
// );

// const qrCodeRoute = require('./qr_codes/route');
// globalRouter.use(
//     apiPath(process.env.API_VERSION, qrCodeRoute.name), 
//     qrCodeRoute.router
// );

module.exports = globalRouter;