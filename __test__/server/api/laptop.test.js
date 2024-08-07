// __tests__/phonebook.test.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Request = require('supertest');
const TestHelper = require('../../../server/helpers/TestHelper');
const laptop = require('../../../server/api/laptop');
const Database = require('../../../server/services/Database');
const Prisma = require('../../../server/services/Prisma');
const Redis = require('../../../server/services/Redis');

jest.mock('../../../server/services/Redis', () => ({
  getKey: jest.fn(),
  setWithExpire: jest.fn()
}));

let server;
let token;
const secretKey = '1tnUQcoV/pJejgFnAx60terg31aJKfszKBvdkCMJJzI=';
describe('Laptop', () => {
  beforeAll(() => {
    process.env.SECRET_KEY = secretKey;
    server = TestHelper.createTestServer('/api', laptop);
    token = jwt.sign({ id: 1 }, secretKey, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await server.close();
  });

  describe('API V1 Query Database', () => {
    describe('GET /v1/laptop', () => {
      it('should return 200 and laptop list, when get list laptop', async () => {
        const mockLaptopList = '[{"id":5,"name":"MSI Bravo 14","price":"9499000.00","stock":7,"brand_id":1}]';

        Redis.getKey.mockResolvedValue(null);
        Redis.setWithExpire.mockResolvedValue(null);

        jest.spyOn(Database, 'getListLaptop').mockResolvedValue(JSON.parse(mockLaptopList));

        const response = await Request(server).get('/api/v1/laptop').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
      });

      it('should return 200 and laptop list from redis', async () => {
        const mockLaptopList = '[{"id":5,"name":"MSI Bravo 14","price":"9499000.00","stock":7,"brand_id":1}]';
        Redis.getKey.mockResolvedValue(mockLaptopList);
        jest.spyOn(Database, 'getListLaptop').mockResolvedValue(mockLaptopList);
        const response = await Request(server).get('/api/v1/laptop').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
      });

      it('should return 404 when laptop not found from redis', async () => {
        const mockLaptopList = '[]';
        Redis.getKey.mockResolvedValue(mockLaptopList);
        jest.spyOn(Database, 'getListLaptop').mockResolvedValue(JSON.parse(mockLaptopList));
        const response = await Request(server).get('/api/v1/laptop').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
      });
      it('should return 404 when laptop not found', async () => {
        jest.spyOn(Database, 'getListLaptop').mockResolvedValue([]);
        const response = await Request(server).get('/api/v1/laptop').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
      });
      it('should return 500 when error', async () => {
        jest.spyOn(Database, 'getListLaptop').mockRejectedValue(new Error('Mock error'));
        const response = await Request(server).get('/api/v1/laptop').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(500);
      });
    });

    describe('POST /v1/laptop', () => {
      it('should return 200 and success message, when add laptop', async () => {
        jest.spyOn(Database, 'addLaptop').mockResolvedValue('success');
        const response = await Request(server)
          .post('/api/v1/laptop')
          .send({
            name: 'Titan 18 HX A14VX',
            price: 3000000,
            stock: 10,
            brand_id: 1
          })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
      });

      it('should return 500 when error', async () => {
        jest.spyOn(Database, 'addLaptop').mockRejectedValue(new Error('Mock error'));
        const response = await Request(server)
          .post('/api/v1/laptop')
          .send({
            name: 'Titan 18 HX A14VX',
            price: 3000000,
            stock: 10,
            brand_id: 1
          })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(500);
      });
    });

    describe('PUT /v1/laptop/:id', () => {
      it('should return 200 and success message, when edit laptop', async () => {
        jest
          .spyOn(Database, 'editLaptop')
          .mockResolvedValue({ name: 'Titan 18 HX A14VX', price: 3000000, stock: 10, brand_id: 1 });
        const response = await Request(server)
          .put('/api/v1/laptop/1')
          .send({
            name: 'Titan 18 HX A14VX',
            price: 6000000,
            stock: 20,
            brand_id: 1
          })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
      });

      it('should return 400 and success message, incorrect body', async () => {
        const response = await Request(server)
          .put('/api/v1/laptop/1')
          .send({
            name: 1,
            price: 6000000,
            stock: 20,
            brand_id: 1
          })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
      });

      it('should return 404 when laptop not found', async () => {
        jest.spyOn(Database, 'editLaptop').mockResolvedValue(false);
        const response = await Request(server)
          .put('/api/v1/laptop/1')
          .send({
            name: 'Titan 18 HX A14VX',
            price: 6000000,
            stock: 20,
            brand_id: 1
          })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
      });

      it('should return 500 when error', async () => {
        jest.spyOn(Database, 'editLaptop').mockRejectedValue(new Error('Mock error'));
        const response = await Request(server)
          .put('/api/v1/laptop/1')
          .send({
            name: 'Titan 18 HX A14VX',
            price: 6000000,
            stock: 20,
            brand_id: 1
          })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(500);
      });
    });

    describe('DELETE /v1/laptop/:id', () => {
      it('should return 200 and success message, when delete laptop', async () => {
        jest.spyOn(Database, 'deleteLaptop').mockResolvedValue({ id: 1 });
        const response = await Request(server).delete('/api/v1/laptop/1').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
      });

      it('should return 404 when laptop not found', async () => {
        jest.spyOn(Database, 'deleteLaptop').mockResolvedValue(false);
        const response = await Request(server).delete('/api/v1/laptop/1').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
      });

      it('should return 500 when error', async () => {
        jest.spyOn(Database, 'deleteLaptop').mockRejectedValue(new Error('Mock error'));
        const response = await Request(server).delete('/api/v1/laptop/1').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(500);
      });
      it('should return 400 when id is not number', async () => {
        const response = await Request(server).delete('/api/v1/laptop/a').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
      });
    });
  });

  describe('APi V2 ORM', () => {
    describe('GET /v2/laptop', () => {
      it('should return 200 and laptop list, when get list laptop', async () => {
        const mockPhonebookList = [
          { id: 1, name: 'Titan 18 HX A14VX', price: 3000000, stock: 10, brand_id: 1 },
          { id: 2, name: 'MSI Bravo 15', price: 9000000, stock: 20, brand_id: 1 }
        ];
        jest.spyOn(Prisma, 'getListLaptopV2').mockResolvedValue(mockPhonebookList);

        const response = await Request(server).get('/api/v2/laptop');
        expect(response.status).toBe(200);
      });

      it('should return 404 when laptop not found', async () => {
        jest.spyOn(Prisma, 'getListLaptopV2').mockResolvedValue([]);
        const response = await Request(server).get('/api/v2/laptop');
        expect(response.status).toBe(404);
      });

      it('should return 500 when error', async () => {
        jest.spyOn(Prisma, 'getListLaptopV2').mockRejectedValue(new Error('Mock error'));
        const response = await Request(server).get('/api/v2/laptop');
        expect(response.status).toBe(500);
      });
    });

    describe('POST /v2/laptop', () => {
      it('should return 200 and success message, when add laptop', async () => {
        jest.spyOn(Prisma, 'addLaptopV2').mockResolvedValue('success');
        const response = await Request(server).post('/api/v2/laptop').send({
          name: 'Titan 18 HX A14VX',
          price: 3000000,
          stock: 10,
          brand_id: 1
        });
        expect(response.status).toBe(200);
      });

      it('should return 500 when error', async () => {
        jest.spyOn(Prisma, 'addLaptopV2').mockRejectedValue(new Error('Mock error'));
        const response = await Request(server).post('/api/v2/laptop').send({
          name: 'Titan 18 HX A14VX',
          price: 3000000,
          stock: 10,
          brand_id: 1
        });
        expect(response.status).toBe(500);
      });
    });

    describe('PUT /v2/laptop/:id', () => {
      it('should return 200 and success message, when edit laptop', async () => {
        jest
          .spyOn(Prisma, 'editLaptopV2')
          .mockResolvedValue({ id: 1, name: 'Titan 18 HX A14VX', price: 3000000, stock: 10, brand_id: 1 });
        const response = await Request(server).put('/api/v2/laptop/1').send({
          name: 'Titan 18 HX A14VX',
          price: 6000000,
          stock: 20,
          brand_id: 1
        });
        expect(response.status).toBe(200);
      });

      it('should return 400 and success message, incorrect body', async () => {
        const response = await Request(server).put('/api/v2/laptop/1').send({
          name: 1,
          price: 3000000,
          stock: 10,
          brand_id: 1
        });
        expect(response.status).toBe(400);
      });

      it('should return 404 when laptop not found', async () => {
        jest.spyOn(Prisma, 'editLaptopV2').mockResolvedValue(false);
        const response = await Request(server).put('/api/v2/laptop/1').send({
          name: 'Titan 18 HX A14VX',
          price: 3000000,
          stock: 10,
          brand_id: 1
        });
        expect(response.status).toBe(404);
      });

      it('should return 500 when error', async () => {
        jest.spyOn(Prisma, 'editLaptopV2').mockRejectedValue(new Error('Mock error'));
        const response = await Request(server).put('/api/v2/laptop/1').send({
          name: 'Titan 18 HX A14VX',
          price: 3000000,
          stock: 10,
          brand_id: 1
        });
        expect(response.status).toBe(500);
      });
    });

    describe('DELETE /v2/laptop/:id', () => {
      it('should return 200 and success message, when delete laptop', async () => {
        jest.spyOn(Prisma, 'deleteLaptopV2').mockResolvedValue({ id: 1 });
        const response = await Request(server).delete('/api/v2/laptop/1');
        expect(response.status).toBe(200);
      });

      it('should return 404 when laptop not found', async () => {
        jest.spyOn(Prisma, 'deleteLaptopV2').mockResolvedValue(false);
        const response = await Request(server).delete('/api/v2/laptop/1');
        expect(response.status).toBe(404);
      });

      it('should return 400 when invalid id', async () => {
        jest.spyOn(Prisma, 'deleteLaptopV2').mockResolvedValue(false);
        const response = await Request(server).delete('/api/v2/laptop/satu');
        expect(response.status).toBe(400);
      });

      it('should return 500 when error', async () => {
        jest.spyOn(Prisma, 'deleteLaptopV2').mockRejectedValue(new Error('Mock error'));
        const response = await Request(server).delete('/api/v2/laptop/1');
        expect(response.status).toBe(500);
      });
    });
  });
  describe('User', () => {
    describe('Login', () => {
      it('should return 200 when user login', async () => {
        const mockLogin = {
          username: 'testing17',
          password: bcrypt.hashSync('testingpassword17*', 10)
        };
        jest.spyOn(Database, 'Login').mockResolvedValue(mockLogin);
        const response = await Request(server)
          .post('/api/v1/laptop/login')
          .send({
            username: 'testing17',
            password: 'testingpassword17*'
          })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
      });
      it('should return 404 when username or password is wrong', async () => {
        const mockLogin = {
          username: 'testing17',
          password: 'testingpassword17*'
        };
        jest.spyOn(Database, 'Login').mockResolvedValue(mockLogin);
        const response = await Request(server)
          .post('/api/v1/laptop/login')
          .send({
            username: 'wrongtesting17',
            password: 'wrongpassword17*'
          })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
      });
      it('should return 401 if no token is provided', async () => {
        const response = await Request(server).get('/api/v1/laptop');
        expect(response.status).toBe(401);
      });
      it('should return 401 if header is invalid', async () => {
        const response = await Request(server).get('/api/v1/laptop').set('Authorization', 'Bearer ');
        expect(response.status).toBe(401);
      });
      it('should return 401 if the token is not valid and user unauthorized', async () => {
        const response = await Request(server).get('/api/v1/laptop').set('Authorization', 'Bearer invalidToken');
        expect(response.status).toBe(401);
      });
      it('should return 500 when error', async () => {
        jest.spyOn(Database, 'Login').mockRejectedValue(new Error('Mock error'));
        const response = await Request(server)
          .post('/api/v1/laptop/login')
          .send({
            username: 'testing',
            password: 'testingpassword'
          })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(500);
      });
    });
    describe('Register', () => {
      it('should return 200 when user register', async () => {
        const mockRegister = {
          username: 'testing17',
          password: bcrypt.hashSync('testing17*', 10)
        };
        jest.spyOn(Database, 'Register').mockResolvedValue(mockRegister);
        const response = await Request(server)
          .post('/api/v1/laptop/register')
          .send({
            username: 'testing17',
            password: 'testing17*'
          })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
      });

      it('should return 500 when error', async () => {
        jest.spyOn(Database, 'Register').mockRejectedValue(new Error('Mock error'));
        const response = await Request(server)
          .post('/api/v1/laptop/register')
          .send({
            username: 'testing17',
            password: 'testing17*'
          })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(500);
      });

      it('should return 400 when username or password does not match the pattern', async () => {
        const mockRegister = {
          username: 'testing',
          password: bcrypt.hashSync('testing17', 10)
        };
        jest.spyOn(Database, 'Register').mockResolvedValue(mockRegister);
        const response = await Request(server)
          .post('/api/v1/laptop/register')
          .send({
            username: 'testing',
            password: 'testing17'
          })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
      });
    });
  });
});
