import app from './app.js'
import database from './db.js'
import run_tests from './tests.js'

// create or open a database stored in the local file test.db
const db = new database('test.db')
// create an app listening to requests on port 3000 that accesses our database
const test_app = new app(3000, db)

run_tests()
