// Global models purpose
const db = require('../tools/db');

const accountModel = require('./accounts/model');
const venueModel = require('./venues/model');
const membershipModel = require('./memberships/model');
const venueAccountModel = require('./venue_accounts/model');
const transactionModel = require('./transactions/model');
const cartModel = require('./cart/model');
const imageVenueModel = require('./images_venue/model');

venueModel.hasMany(
    membershipModel,
    {
        foreignKey: 'venue_id',
        as: 'memberships'
    }
);

membershipModel.belongsTo(venueModel, {
    foreignKey: 'venue_id',
    targetKey: 'uuid',
    as: 'venue'
});

accountModel.belongsTo(venueAccountModel, {
    foreignKey: 'uuid',
    targetKey: 'id_account',
    as: 'venue_account',
});

transactionModel.hasMany(
    cartModel,
    {
        foreignKey: 'id_transaction',
        targetKey: 'id_transaction',
        as: 'carts'
    }
);

cartModel.belongsTo(transactionModel, {
    foreignKey: 'id_transaction',
    targetKey: 'id_transaction',
    as: 'transaction'
});

cartModel.belongsTo(
    membershipModel,
    {
        foreignKey: 'id_item',
        as: 'product_info'
    }
);

membershipModel.hasMany(cartModel, {
    foreignKey: 'id_transaction',
    as: 'item'
});

imageVenueModel.belongsTo(venueModel, {
    foreignKey: 'venue',
    targetKey: 'uuid',
    as: 'm_venue',
});

venueModel.hasMany(
    imageVenueModel,
    {
        foreignKey: 'venue',
        as: 'gallery'
    }
);



// membershipModel.belongsTo(cartModel, {
//     foreignKey: 'id',
//     targetKey: 'id_item',
//     as: 'carts_list',
// });

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
    venueAccountModel,
    transactionModel,
    cartModel,
    imageVenueModel,
    db
};