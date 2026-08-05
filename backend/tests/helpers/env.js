// Runs before any test file loads (see jest.setupFiles in package.json).
// app.js no longer calls dotenv.config() itself (that only happens in
// index.js, the real entry point) specifically so tests control their
// own environment instead of picking up whatever's in a local .env.
process.env.JWT_SECRET = 'test-only-secret-do-not-use-outside-tests';
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
