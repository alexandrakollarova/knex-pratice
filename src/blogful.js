require('dotenv').config()
const ArticlesService = require('./articles-service')
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})

console.log(ArticlesService.getAllArticles())