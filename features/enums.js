

const userTypeEnum = {
    SUPERADMIN: 'super admin',
    ADMINVENUE: 'admin venue',
    CUSTOMER: 'customer'
}

const statusTransactionEnum = {
    PICKING: 'picking',
    WAITING: 'waiting approval',
    PAYMENT_VALID: 'approval valid',
    ON_DELIVERY: 'on delivery',
    COMPLETED: 'completed',
}

const cartItemTypeEnum = {
    MEMBERSHIP_CARD: 'membership',
    ITEM: 'item'
}

module.exports = {
    userTypeEnum,
    statusTransactionEnum,
    cartItemTypeEnum
}