const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe('Shopping list service object', () => {
    let testDB
    let testProducts = [
            {
                id: 1,
                name: 'Test product name1',
                price: '1.00',
                category: 'Main',
                checked: false,
                date_added: new Date('2029-01-22T16:28:32.615Z')            
            },
            {
                id: 2,
                name: 'Test product name2',
                price: '2.00',
                category: 'Snack',
                checked: false,
                date_added: new Date('2029-01-22T16:28:32.615Z') 
            },
            {
                id: 3,
                name: 'Test product name3',
                price: '3.00',
                category: 'Lunch',
                checked: false,
                date_added: new Date('2029-01-22T16:28:32.615Z') 
            },
        ]  
       
        // connect to the 'test' database = knex_practice_test
        before(() => {
            testDB = knex({
                client: 'pg',
                connection: process.env.DB_URL
            })
        })

        // remove data before each time we run a new test
        before(() => testDB('shopping_list').truncate())

        // remove data after each test we ran
        afterEach(() => testDB('shopping_list').truncate())
    
        // destroy database after tests are done
        after(() => testDB.destroy())



        describe('getAllProducts()', () => {
            context("Given 'shopping_list' has data", () => {
                beforeEach(() => {
                    return testDB
                        .into('shopping_list')
                        .insert(testProducts)
                })

                it("getAllProducts() resolves all products from 'shopping_list' table", () => {
                    return ShoppingListService.getAllProducts(testDB)
                        .then(actual => {
                            expect(actual).to.eql(testProducts.map(item => ({
                                ...item,
                                date_added: new Date(item.date_added)
                            })))
                        })
                })

                it(`getById() resolves an item by id from 'shopping_list' table`, () => {
                    const thirdId = 3
                    const thirdTestItem = testProducts[thirdId - 1]
                    return ShoppingListService.getById(testDB, thirdId)
                        .then(actual => {
                            expect(actual).to.eql({
                               id: thirdId,
                               name: thirdTestItem.name,
                               price: thirdTestItem.price,
                               category: thirdTestItem.category,
                               checked: thirdTestItem.checked,
                               date_added: thirdTestItem.date_added,
                             })
                        })
                })
    
                it(`deleteProduct() removes an item by id from 'shopping_list' table`, () => {
                    const itemId = 3
                    return ShoppingListService.deleteProduct(testDB, itemId)
                        .then(() => ShoppingListService.getAllProducts(testDB))
                        .then(allItems => {
                             const expected = testProducts.filter(item => item.id !== itemId)
                             expect(allItems).to.eql(expected)
                        })
                })
    
                it(`updateProduct() updates an item from the 'shopping_list' table`, () => {
                    const idOfItemToUpdate = 2
                    const newItemData = {
                        name: 'updated name',
                        price: '10.00',
                        category: "Lunch",
                        checked: false,
                        date_added: new Date()
                    }
    
                    return ShoppingListService.updateProduct(testDB, idOfItemToUpdate, newItemData)
                        .then(() => ShoppingListService.getById(testDB, idOfItemToUpdate))
                        .then(item => {
                            expect(item).to.eql({
                                id: idOfItemToUpdate,
                               ...newItemData,
                             })
                        })
                })
            })
        })
})

