// An explicit factory mock, rather than jest.mock('../models/property')
// with no factory: auto-mocking a full Mongoose Model class walks a lot
// of built-in prototype/static surface and is fragile. We only need
// findById here.
jest.mock('../models/property', () => ({
    findById: jest.fn(),
}));

const Property = require('../models/property');
const ownerController = require('../controllers/ownerController');

function mockRes() {
    return {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    };
}

describe('ownerController.editProperty', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('looks up the property via the Property model, not an undefined reference', async () => {
        // This is the direct regression guard for the TextTrackList bug:
        // the old code called `TextTrackList.findById(...)`, an
        // undefined variable. That threw a ReferenceError that was
        // swallowed by the surrounding try/catch and reported back as
        // a misleading 400 ("TextTrackList is not defined"). If that
        // regresses, Property.findById is never reached and this
        // assertion fails.
        const fakeProperty = {
            _id: 'prop1',
            owner_id: { toString: () => 'owner-a' },
            save: jest.fn().mockResolvedValue(true),
        };
        Property.findById.mockResolvedValue(fakeProperty);

        const req = { params: { id: 'prop1' }, user: { id: 'owner-a' }, body: { name: 'New name' } };
        const res = mockRes();

        await ownerController.editProperty(req, res);

        expect(Property.findById).toHaveBeenCalledWith('prop1');
        expect(res.status).not.toHaveBeenCalledWith(400);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('rejects with 403 when the requester is not the property owner', async () => {
        const fakeProperty = {
            _id: 'prop1',
            owner_id: { toString: () => 'owner-a' },
            save: jest.fn().mockResolvedValue(true),
        };
        Property.findById.mockResolvedValue(fakeProperty);

        const req = { params: { id: 'prop1' }, user: { id: 'owner-b' }, body: { name: 'Hijacked' } };
        const res = mockRes();

        await ownerController.editProperty(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(fakeProperty.save).not.toHaveBeenCalled();
    });

    it('allows the actual owner to edit their own property', async () => {
        const fakeProperty = {
            _id: 'prop1',
            owner_id: { toString: () => 'owner-a' },
            name: 'Old name',
            save: jest.fn().mockResolvedValue(true),
        };
        Property.findById.mockResolvedValue(fakeProperty);

        const req = { params: { id: 'prop1' }, user: { id: 'owner-a' }, body: { name: 'Updated name' } };
        const res = mockRes();

        await ownerController.editProperty(req, res);

        expect(fakeProperty.save).toHaveBeenCalled();
        expect(fakeProperty.name).toBe('Updated name');
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('returns 400 when the property does not exist', async () => {
        Property.findById.mockResolvedValue(null);

        const req = { params: { id: 'missing' }, user: { id: 'owner-a' }, body: {} };
        const res = mockRes();

        await ownerController.editProperty(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });
});
