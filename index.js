const dotenv = require('dotenv');
const process = require('process');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = require("./features/app");
const socket = require("./features/socket");

// api services
const server = app.listen(process.env.API_PORT, async function () {
    return console.log(`Backend service running on port ${process.env.API_PORT}`);
});

// socket services
socket(server);