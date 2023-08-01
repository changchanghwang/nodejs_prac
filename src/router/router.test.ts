import * as request from 'supertest';
import { getApp, getBodyParser } from '../../test';
import { Router } from '.';

describe('router test', () => {
  it('should be defined', () => {
    expect(Router).toBeDefined();
  });

  it('should instance can be created', () => {
    const router = new Router();
    expect(router).toBeDefined();
  });

  describe('GET test', () => {
    it('should return plain text with return statement', async () => {
      const app = getApp();
      const router = new Router();
  
      router.get('/ping', (req, res) => {
        res.statusCode = 202;
        return 'pong';
      });
  
      app.use(router.middleware());
  
      const response = await request(app.callback()).get('/ping');
      expect(response.statusCode).toBe(202);
      expect(response.text).toBe('pong');
    });
  
    it('should return json with return statement', async () => {
      const app = getApp();
      const router = new Router();
  
      router.get('/ping', (req, res) => {
        res.statusCode = 202;
        return { message: 'pong' };
      });
  
      app.use(router.middleware());
  
      const response = await request(app.callback()).get('/ping');
      expect(response.statusCode).toBe(202);
      expect(response.body).toStrictEqual({ message: 'pong' });
    });
  
    it('should return plain text with "res.body = something" statement', async () => {
      const app = getApp();
      const router = new Router();
  
      router.get('/ping', (req, res) => {
        res.statusCode = 202;
        res.body = 'pong';
      });
  
      app.use(router.middleware());
  
      const response = await request(app.callback()).get('/ping');
      expect(response.statusCode).toBe(202);
      expect(response.text).toStrictEqual('pong');
    });
  
    it('should return json with "res.body = something" statement', async () => {
      const app = getApp();
      const router = new Router();
  
      router.get('/ping', (req, res) => {
        res.statusCode = 202;
        res.body = { message: 'pong' };
      });
  
      app.use(router.middleware());
  
      const response = await request(app.callback()).get('/ping');
      expect(response.statusCode).toBe(202);
      expect(response.body).toStrictEqual({ message: 'pong' });
    });

    it('should work with multiple routes', async () => {
      const app = getApp();
      const router = new Router();
  
      router.get('/ping', (req, res) => {
        res.body = 'ok';
      });

      router.get('/ping2', (req, res) => {
        res.body = 'ok2';
      });
  
      app.use(router.middleware());
  
      const response = await request(app.callback()).get('/ping');
      expect(response.statusCode).toBe(200);
      expect(response.text).toStrictEqual('ok');
      
      const response2 = await request(app.callback()).get('/ping2');
      expect(response2.statusCode).toBe(200);
      expect(response2.text).toStrictEqual('ok2');
    })
  });

  describe('POST test', () => {
    it('should get json response from api call', async () => {
      const app = getApp();
      const router = new Router();

      router.post('/ping', (req, res) => {
        res.statusCode = 201;
        res.body = { message: 'created' };
      })

      app.use(router.middleware());

      const response = await request(app.callback()).post('/ping');
      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual({ message: 'created' });
      expect(response.text).toStrictEqual(JSON.stringify({ message: 'created' }));
    });

    it('should get request body in middleware', async () => {
      const app = getApp();
      const router = new Router();

      router.post('/ping', (req, res) => {
        res.statusCode = 201;
        return req.body;
      })

      app.use(getBodyParser());
      app.use(router.middleware());

      const response = await request(app.callback()).post('/ping').send({ name: "Lee" });
      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual({ name: "Lee" });
      expect(response.text).toStrictEqual(JSON.stringify({ name: "Lee" }));
    });
  });
});
