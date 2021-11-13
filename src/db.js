import sqlite3 from 'sqlite3'
import message from './message.js'
import { zip_strings, string_any } from './utils.js'

// database class, right now just operates on the user table
export default class database
{
  constructor(filepath)
  {
    // Name and type of all columns in the user table. Right now password
    // is stored as a string, needs to be encrypted in future.
    this.columns =
    [
      { name: 'username', type: 'VARCHAR' },
      { name: 'password', type: 'VARCHAR' },
      { name: 'first_name', type: 'VARCHAR' },
      { name: 'last_name', type: 'VARCHAR' },
      { name: 'age', type: 'INT' }
    ]
    // create the database
    this.db = new sqlite3.Database(filepath)
    // make sure the contained instructions happen in sequence (default is asynchronous)
    this.db.serialize(() =>
    {
      // remove the users table
      this.db.run('DROP TABLE IF EXISTS users')
      // create a new users table with the schema specified by this.columns
      this.db.run(`CREATE TABLE users (${zip_strings(this.columns)})`)
    })
  }

  // attempts to get the user named `username` and sends a response to `res`
  get({ username }, res)
  {
    if(!username)
      res.send(new message('must provide a username'))

    this._if_exists(username,
      row => res.send(new message('successfully retrieved user', row)),
      () => res.send(new message(`user '${username}' does not exist`))
    )
  }

  // attempts to create a user and sends a response to `res`
  create(values, res)
  {
    // check that `values` contains an entry for every column in the table
    // (default values aren't supported, everything must be set explicitly)
    for(var field of this.columns.map(e => e.name))
    {
        if(!values[field])
        {
          // found a column that `values` does not specify a value for
          res.send(new message(`create_user query must contain '${field}'`))
          return
        }
    }
    if(!values.verify_password)
    {
      res.send(new message('password must be typed twice and sent using verify_password'))
      return
    }

    // check username and password requirements
    if(string_any(values.username, c => /\s/.test(c)))
    {
      res.send(new message('username cannot contain spaces'))
      return
    }
    if(!string_any(values.username, c => /[a-zA-Z]/.test(c)))
    {
      res.send(new message('username must contain at least 1 letter'))
      return
    }
    if(values.password.length <= 8)
    {
      res.send(new message('password must be at least 9 characters'))
      return
    }
    if(values.password !== values.verify_password)
    {
      res.send(new message('passwords do not match'))
      return
    }

    // If a user with the same username already exists, return a message saying as much.
    // Otherwise, create the new user according to `values` and return a success message.
    // If user creation fails for some reason, an error message is returned instead.
    this._if_exists(values.username,
      () => res.send(new message(`user '${values.username}' already exists`)),
      () => this.db.run(`INSERT INTO users VALUES ("${values.username}", "${values.password}", "${values.first_name}", "${values.last_name}", ${values.age})`,
        err => err ? res.send(new message('user creation error', err)) : res.send(new message(`successfully created user '${values.username}'`, values))
      )
    )
  }

  // attempts to delete the user named `username` and sends a response to `res`
  delete({ username }, res)
  {
    if(!username)
      res.send(new message('must provide a username'))
    // If a user named `username` exists, delete it from the table and return a success message.
    // If the user doesn't exist, return a message saying as much.
    // If user deletion fails for some reason, an error message is returned instead
    this._if_exists(username,
      () => this.db.run(`DELETE FROM users WHERE username="${username}"`,
        err => err ? res.send(new message('user deletion error', err)) : res.send(new message(`successfully deleted user '${username}'`))
      ),
      () => res.send(new message(`user '${username}' does not exist`)),
    )
  }

  login({ username, password }, res)
  {
    if(!(username && password))
      res.send(new message('must provide a username and password'))

    this._if_exists(username,
      row =>
      {
        if(password === row.password)
          res.send(new message(`successfully logged in user '${username}'`))
        else
          res.send(new message(`incorrect password for user '${username}'`))
      },
      () => res.send(new message(`user '${username}' does not exist`))
    )
  }

  // if a user named `username` exists, invoke `yes` on that user otherwise run `no`
  _if_exists(username, yes, no)
  {
    this.db.get(`SELECT * FROM users WHERE username="${username}"`, (err, row) => row ? yes(row) : no())
  }
}
