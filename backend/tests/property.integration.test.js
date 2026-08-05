const request = require('supertest');
const path = require('path');
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

const testImage = path.join(__dirname, 'fixtures', 'test-image.png');

let userCounter = 0;
async function signUpAndLogin(role) {
    userCounter += 1;
    const user = {
        role,
        name: `Test ${role} ${userCounter}`,
        email: `${role}${userCounter}@example.com`,
        password: 'correctHorse123',
        mobile: 9999999999,
    };

    await request(app).post('/signUp').send(user);
    const loginRes = await request(app).post('/login').send({
        email: user.email,
        password: user.password,
        role: user.role,
    });

    const payload = JSON.parse(Buffer.from(loginRes.body.jwt.split('.')[1], 'base64').toString());
    return { token: loginRes.body.jwt, id: payload.id };
}

const baseFields = {
    name: 'Test Property',
    desc: 'A nice place to stay',
    rent: '5000',
    deposite: '1000',
    address: '123 Test St',
    landmark: 'Near Test Landmark',
    propertyType: 'Hostel/PG',
    tenantType: 'Anyone',
};

function attachBaseFields(req) {
    return Object.entries(baseFields)
        .reduce((r, [key, value]) => r.field(key, value), req)
        .field('roomAmenities', JSON.stringify(['Wifi']))
        .field('roomType', JSON.stringify(['Single']))
        .field('rules', JSON.stringify([]));
}

describe('POST /addProperty/:id', () => {
    it('succeeds for an authenticated owner', async () => {
        const owner = await signUpAndLogin('owner');

        const res = await attachBaseFields(
            request(app).post(`/addProperty/${owner.id}`).set('Authorization', `Bearer ${owner.token}`)
        ).attach('photos', testImage);

        expect(res.status).toBe(201);
        expect(res.body.property.name).toBe('Test Property');
        expect(res.body.property.owner_id).toBe(owner.id);
        expect(res.body.property.photos).toHaveLength(1);
        expect(res.body.property.photos[0]).toMatch(/^\/uploads\/.+\.png$/);
    });

    it('fails for an authenticated tenant', async () => {
        const tenant = await signUpAndLogin('tenant');

        const res = await attachBaseFields(
            request(app).post(`/addProperty/${tenant.id}`).set('Authorization', `Bearer ${tenant.token}`)
        );

        expect(res.status).toBe(403);
    });

    it('fails with no token at all', async () => {
        const res = await attachBaseFields(request(app).post('/addProperty/000000000000000000000000'));
        expect(res.status).toBe(401);
    });
});

describe('POST /editProperty/:id', () => {
    it('returns 403 when the requester is not the property owner', async () => {
        const ownerA = await signUpAndLogin('owner');
        const ownerB = await signUpAndLogin('owner');

        const createRes = await attachBaseFields(
            request(app).post(`/addProperty/${ownerA.id}`).set('Authorization', `Bearer ${ownerA.token}`)
        );
        expect(createRes.status).toBe(201);
        const propertyId = createRes.body.property._id;

        const editRes = await request(app)
            .post(`/editProperty/${propertyId}`)
            .set('Authorization', `Bearer ${ownerB.token}`)
            .send({ name: 'Hijacked by owner B' });

        expect(editRes.status).toBe(403);
    });

    it('succeeds when the requester is the actual property owner', async () => {
        const owner = await signUpAndLogin('owner');

        const createRes = await attachBaseFields(
            request(app).post(`/addProperty/${owner.id}`).set('Authorization', `Bearer ${owner.token}`)
        );
        const propertyId = createRes.body.property._id;

        const editRes = await request(app)
            .post(`/editProperty/${propertyId}`)
            .set('Authorization', `Bearer ${owner.token}`)
            .send({
                name: 'Updated name',
                desc: baseFields.desc,
                address: baseFields.address,
                rent: 6000,
                deposite: 1000,
                facilities: null,
                rooms_available: null,
                roomType: ['Single'],
                bhkType: null,
                tenant: null,
            });

        expect(editRes.status).toBe(200);
    });
});
