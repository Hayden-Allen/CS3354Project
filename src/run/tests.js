import superagent from 'superagent'
import init from '../main.js'

const BASE_URL = 'http://localhost:3000/'
const TYPE_POST = 'post', TYPE_GET = 'get'
let result_string = ''

/**
 * Helper method to run a single test
 * @param  {string}   header the name of the test that is printed to the console
 * @param  {function} fn     the function that contains your test code. Should
 *                           make use of `assert` below to check if the response
 *                           received from the server matches the expected result
 */
async function run_test(header, type, stub, expected)
{
  result_string += `\t${header}: `
  const res = await superagent[type](BASE_URL + stub)
  result_string += `${assert(res.body.msg, expected)}\n`
}
function start_endpoint(name)
{
  result_string += `\n\n${name}\n`
}
function start_tests()
{
  result_string = ''
  console.log('Running tests...')
}
function end_tests()
{
  console.log(`Tests complete. Results:\n${result_string}`)
}

/**
 * Simply checks if `condition` is true. If not, returns an error string
 * @param  {bool} condition
 */
function assert(actual, expected)
{
  if(actual !== expected)
    return `"${actual}" != "${expected}"`
  return 'passed'
}

async function run_tests()
{
  start_tests()

  start_endpoint('create_account')
  await run_test(
    'valid',
    TYPE_POST,
    'create_user?username=John_Doe&first_name=John&last_name=Doe&age=20&password=Pass1234567&verify_password=Pass1234567',
    `successfully created user 'John_Doe'`
  )
  await run_test(
    'invalid - space in username',
    TYPE_POST,
    'create_user?username=John Doe&first_name=John&last_name=Doe&age=20&password=Pass1234567&verify_password=Pass1234567',
    'username cannot contain spaces'
  )
  await run_test(
    'invalid - no letters in username',
    TYPE_POST,
    'create_user?username=123456&first_name=John&last_name=Doe&age=20&password=Pass1234567&verify_password=Pass1234567',
    'username must contain at least 1 letter'
    )
  await run_test(
    'invalid - password too short',
    TYPE_POST,
    'create_user?username=John_Doe&first_name=John&last_name=Doe&age=20&password=123&verify_password=123',
    'password must be at least 9 characters'
  )
  await run_test(
    `invalid - passwords don't match`,
    TYPE_POST,
    'create_user?username=John_Doe&first_name=John&last_name=Doe&age=20&password=1234567000&verify_password=122105155',
    'passwords do not match'
  )



  start_endpoint('login_user')
  await run_test(
    `valid`,
    TYPE_GET,
    'login_user?username=John_Doe&password=Pass1234567',
    `successfully logged in user 'John_Doe'`
  )
  await run_test(
    `invalid - user doesn't exist`,
    TYPE_GET,
    'login_user?username=John Doe&password=Pass1234567',
    `user 'John Doe' does not exist`
  )
  await run_test(
    `invalid - incorrect password`,
    TYPE_GET,
    'login_user?username=John_Doe&password=123',
    `incorrect password for user 'John_Doe'`
  )

  end_tests()
}

const app = init()
await run_tests()
app.close()