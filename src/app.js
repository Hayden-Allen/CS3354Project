import express from 'express'

// encapsulates functionality of an express app instance
export default class app
{
  constructor(port, db)
  {
    // create the app
    this.app = express()
    // open communications on the given port and print a message once ready for requests
    this.app.listen(port)
    // bind database methods to API endpoints
    this.app.get('/get_user', (req, res) => db.get(req.query, res))
    this.app.post('/create_user', (req, res) => db.create(req.query, res))
    this.app.delete('/delete_user', (req, res) => db.delete(req.query, res))
    this.app.get('/login_user', (req, res) => db.login(req.query, res))
  }
}
