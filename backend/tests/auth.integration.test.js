const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { connect, closeDatabase, clearDatabase } = require('./helpers/db');

beforeAll(async () => {
    await connect();
});

afterEach(async () => {
    await clearDatabase();
});

afterAll(async () => {
    await closeDatabase();
});

const validSignUp = {
    role: 'tenant',
    name: 'Test User',
    email: 'test.user@example.com',
    password: 'correctHorse123',
    mobile: 9999999999,
};

describe('POST /signUp', () => {
    it('creates a user on valid input', async () => {
        const res = await request(app).post('/signUp').send(validSignUp);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Signup Successful!');
    });
});

describe('POST /login', () => {
    beforeEach(async () => {
        await request(app).post('/signUp').send(validSignUp);
    });

    it('logs in with correct credentials and returns a jwt', async () => {
        const res = await request(app).post('/login').send({
            email: validSignUp.email,
            password: validSignUp.password,
            role: validSignUp.role,
        });

        expect(res.status).toBe(200);
        expect(typeof res.body.jwt).toBe('string');

        const decoded = jwt.decode(res.body.jwt);
        expect(decoded.role).toBe('tenant');
    });

    // Day 1's user-enumeration fix: a wrong password on a real account
    // and a login attempt against an email that was never registered
    // must be indistinguishable to the caller - same status, same
    // body. Two different messages ("wrong password" vs "user not
    // found") would let an attacker enumerate which emails have
    // accounts just from the response.
    it('returns the identical status and body for a wrong password and a nonexistent email', async () => {
        const wrongPassword = await request(app).post('/login').send({
            email: validSignUp.email,
            password: 'totallyWrongPassword',
            role: validSignUp.role,
        });

        const nonexistentEmail = await request(app).post('/login').send({
            email: 'never.signed.up@example.com',
            password: 'whateverPassword123',
            role: validSignUp.role,
        });

        expect(wrongPassword.status).toBe(401);
        expect(nonexistentEmail.status).toBe(401);
        expect(wrongPassword.status).toBe(nonexistentEmail.status);
        expect(wrongPassword.body).toEqual(nonexistentEmail.body);
        expect(wrongPassword.body.message).toBe('Invalid email or password');
    });
});

describe('protected routes', () => {
    // /addReview requires a token (verifyToken runs before zod
    // validation on that route), so an invalid/missing token is
    // rejected before the request body is ever inspected. The body
    // below is valid-shaped anyway, so a failure can only be coming
    // from the auth check, not validation.
    const reviewBody = {
        property_id: '507f1f77bcf86cd799439011',
        user_id: '507f1f77bcf86cd799439011',
        rating: 5,
        comment: 'test',
    };

    it('rejects a request with no token', async () => {
        const res = await request(app).post('/addReview').send(reviewBody);
        expect(res.status).toBe(401);
    });

    it('rejects a request with an expired token', async () => {
        const expiredToken = jwt.sign(
            { id: '507f1f77bcf86cd799439011', role: 'tenant' },
            process.env.JWT_SECRET,
            { expiresIn: -10 }
        );

        const res = await request(app)
            .post('/addReview')
            .set('Authorization', `Bearer ${expiredToken}`)
            .send(reviewBody);

        expect(res.status).toBe(401);
    });

    it('rejects a request with a tampered token', async () => {
        const validToken = jwt.sign(
            { id: '507f1f77bcf86cd799439011', role: 'tenant' },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );
        const tamperedToken = `${validToken.slice(0, -5)}xxxxx`;

        const res = await request(app)
            .post('/addReview')
            .set('Authorization', `Bearer ${tamperedToken}`)
            .send(reviewBody);

        expect(res.status).toBe(401);
    });

    it('rejects a token signed with a different secret', async () => {
        const forgedToken = jwt.sign(
            { id: '507f1f77bcf86cd799439011', role: 'tenant' },
            'not-the-real-secret',
            { expiresIn: '2h' }
        );

        const res = await request(app)
            .post('/addReview')
            .set('Authorization', `Bearer ${forgedToken}`)
            .send(reviewBody);

        expect(res.status).toBe(401);
    });
});
