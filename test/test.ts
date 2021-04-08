import { XMLAttribute, XMLChild, XMLChildren, XMLElement, XMLValue } from '../src'

class Message extends XMLElement {
  @XMLAttribute() type: string
  @XMLValue({ type: 'string' }) text: string
}

class Status extends XMLElement {
  @XMLAttribute({ type: 'integer' }) code: number
  @XMLValue({ type: 'string' }) text: string
}

class Response extends XMLElement {
  @XMLAttribute() type: string
  @XMLAttribute({ type: 'integer', name: 'code', path: ['status'] }) statusCode: number
  @XMLValue({ type: 'string', path: ['status'] }) statusText: string
  @XMLChild({ type: Status, name: 'status' }) status: Status
  @XMLValue({ type: 'string', path: ['messages', 'message'] }) message: string
  @XMLChildren({ type: Message, path: ['messages'], name: 'message' }) messages: Message[]
}

const response = new Response(`
<response type="login">
  <status code="200">OK</status>
  <messages>
    <message type="info">Login successful</message>
    <message type="warning">Your session is valid for 12 days</message>
  </messages>
  </response>`)

console.info(response)
