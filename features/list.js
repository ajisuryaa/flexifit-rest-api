// Global attributes for model
const membershipAttributes = ['id', 'venue_id', 'name', 'description', 'price', 'created_at', 'updated_at'];
const venueAttributes = ['uuid', 'name', 'address', 'contact_number', 'longitude', 'latitude', 'created_at', 'updated_at'];
const levelAttributes = ['id_account', 'id_venue', 'level_account'];
const cartAttributes = ['id_transaction', 'quantity', 'price', 'total_price', 'type']; 
module.exports = {
    membershipAttributes,
    venueAttributes,
    levelAttributes,
    cartAttributes
}