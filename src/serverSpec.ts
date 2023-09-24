import supertest from 'supertest';
import app from './app';

const request = supertest(app);
describe('Test endpoint response', () => {
    it('test main route "/"', async () => {
        const response = await request.get('/');
        expect(response.status).toBe(200); 
    });
    });
