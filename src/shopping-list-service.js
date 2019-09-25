const ShoppingListService = {
    // read
    getAllProducts(knex) {
        return knex 
            .select('*')
            .from('shopping_list')
    },

    // create
    addProduct(knex, newItem) {
        return knex
            .insert(newItem)
            .into('shopping_list')
            // all columns selected
            .returning("*")
            .then(rows => {
                return rows[0]
            })
    },

    // get by id
    getById(knex, id) {
        return knex 
            .from('shopping_list')
            .select('*')
            .where('id', id)
            .first()
    },

    // delete
    deleteProduct(knex, id) {
        return knex('shopping_list')
            .where({id})
            .delete()
    },

    // update
    updateProduct(knex, id, newProductFields) {
        return knex('shopping_list')
            .where({id})
            .update(newProductFields)
    }
}

module.exports = ShoppingListService