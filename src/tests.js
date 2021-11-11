import http from 'http'
import superagent from 'superagent'

/**
 * Helper method to run a single test
 * @param  {string}   header the name of the test that is printed to the console
 * @param  {function} fn     the function that contains your test code. Should
 *                           make use of `assert` below to check if the response
 *                           received from the server matches the expected result
 */
function run_test(header, fn)
{
  console.log(`\t${header}`)
  fn()
}

/**
 * Simply checks if `condition` is true. If not, throws an error
 * @param  {bool} condition
 */
function assert(condition)
{
  if(!condition)
    throw new Error(`assertion fail`)
}

export default function run_tests()
{
  console.log('RUN TESTS')

  // Note that the database is cleared everytime you restart the app to run the tests.
  // For example, to get the user named 'test' send a GET request to http://localhost:3000/get_user?username=test
  // This will fail because no users exist yet, so there is nothing to get.
  run_test('get_user', async () =>
  {
    const res = await superagent.get('http://localhost:3000/get_user?username=test')
    assert(res.body.msg === "user 'test' does not exist")
  })

  // The HTTP request methods for the API endpoints implemented thus far are as follows:
  //    get_user    - GET
  //    create_user - POST
  //    delete_user - DELETE
  //    login_user  - GET
  // Make sure to use superagent.get for get_user/login_user, superagent.post for create_user,
  // and superagent.delete for delete_user

  // What you test should be along these lines (and in this order):
  //
  // 1. get account (expect error - it doesn't exist yet)
  // 2. create an account (expect success)
  // 3. create an account with the same username as the previous one (expect error - it already exists)
  // 4. get account (expect success - it exists now that you created it)
  // 5. delete account (expect success)
  // 6. delete account again (expect error - it no longer exists)
  // 7. get account (expect error - it no longer exists)
  // 8. create account (expect success - it no longer exists)

  console.log('TESTS COMPLETE')
}
