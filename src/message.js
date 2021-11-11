// encapsulates message data that is sent back to the client
export default class message
{
  constructor(msg, data)
  {
    // string message
    this.msg = msg
    // other data (usually an object)
    this.data = data
  }
}
