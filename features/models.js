// Global models purpose
const Sequelize = require('sequelize');
const db = require('../tools/db');

const accountModel = require('./accounts/model');
const venueModel = require('./venues/model');
const membershipModel = require('./memberships/model');

// Relation model
// Registration relation
// membershipModel.hasMany(
//     venueModel,
//     {
//         foreignKey: 'uuid',
//         as: 'venues'
//     }
// );
// registrationModel.belongsTo(userModel, {
//     foreignKey: 'created_by',
//     as: 'created_user'
// });
// registrationModel.belongsTo(userModel, {
//     foreignKey: 'updated_by',
//     as: 'updated_user'
// });

// // Attendance relation
// attendanceModel.belongsTo(
//     registrationModel,
//     {
//         foreignKey: 'reg_id',
//         targetKey: 'id',
//         as: 'registration'
//     }
// );
// attendanceModel.belongsTo(userModel, {
//     foreignKey: 'created_by',
//     as: 'scanner_creator'
// });
// attendanceModel.belongsTo(userModel, {
//     foreignKey: 'updated_by',
//     as: 'scanner_updetor'
// });

module.exports = {
    accountModel,
    venueModel,
    membershipModel,
    db
};