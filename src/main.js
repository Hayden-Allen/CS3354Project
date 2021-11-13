import application from './application.js'
import database from './db.js'

export default function init()
{
  // create or open a database stored in the local file test.db
  const db = new database('test.db')
  // create an app listening to requests on port 3000 that accesses our database
  const app = new application(3000, db)
  return app
}