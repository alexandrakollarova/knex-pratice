require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})

function getAllItemsThatContainText(searchTerm) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

// getAllItemsThatContainText('bread')

function getAllItemsPaginated(pageNumber) {
    const limit = 6
    const offset = productsPerPage * (page - 1)
    knexInstance
      .select('*')
      .from('shopping_list')
      .limit(limit)
      .offset(offset)
      .then(result => {
            console.log(result)
      })
}

// getAllItemsPaginated(4)

function getAllItemsAddedAfterDate(daysAgo) {
    knexInstance
        .select('id', 'name', 'price', 'category', 'checked', 'date_added')
        .count('date_added')
        .where(
        'date_viewed',
        '>',
        knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .from('shopping_list')
        .then(result => {
            console.log(result)
        })
}

// getAllItemsAddedAfterDate(3)

function getTheTotalCostForEachCategory() {
    knexInstance
        .select('category')
        .sum('price as total')
        .from('shopping_list')
        .count('price')
        .groupBy('category')
        .then(result => {
            console.log(result)
        })
}

// getTheTotalCostForEachCategory()