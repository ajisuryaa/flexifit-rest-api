// Global models purpose
const Sequelize = require('sequelize');
const db = require('../tools/db');

const accountModel = require('./accounts/model');

// Relation model
// Registration relation
// registrationModel.hasMany(
//     attendanceModel,
//     {
//         foreignKey: 'reg_id',
//         as: 'attendances'
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
    db
};