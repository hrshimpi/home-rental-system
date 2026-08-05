const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

// Real MongoDB (in-memory, not a mock) so integration tests exercise
// actual Mongoose schema validation/query behavior, without touching
// a real database.
async function connect() {
    mongod = await MongoMemoryServer.create();
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongod.getUri());
}

async function closeDatabase() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongod) {
        await mongod.stop();
    }
}

async function clearDatabase() {
    const { collections } = mongoose.connection;
    await Promise.all(
        Object.values(collections).map((collection) => collection.deleteMany({}))
    );
}

module.exports = { connect, closeDatabase, clearDatabase };
