require('dotenv').config();

// Set test environment
process.env.NODE_ENV = 'test';

// If no JWT_SECRET is set for tests, provide a default one
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-jwt-secret-key';
}

// If no JWT_EXPIRES_IN is set, provide a default
if (!process.env.JWT_EXPIRES_IN) {
  process.env.JWT_EXPIRES_IN = '1h';
}

// If no MONGO_URI is set, use a default test database connection
if (!process.env.MONGO_URI) {
  process.env.MONGO_URI = 'mongodb://localhost:27017/mern-auth-module-test';
}