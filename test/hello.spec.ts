import request from "supertest"
import app, {server} from "../app/index"

describe('Example suite', () => {
  afterAll((done) => {
    server.close(() => {
      console.log('Server closed');
      done();
    });
  })
  test('hello world', async () => {
    const res = await request(app).get('/')
    console.log(res);
    
    expect(res.body).toEqual({ message: "hello world"})
  })

})
