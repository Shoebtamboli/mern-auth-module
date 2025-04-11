const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/user.model');

describe('Auth Routes', () => {
  // Test user data
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Test@123!',
    confirmPassword: 'Test@123!'
  };
  
  // Clean up database before and after tests
  beforeAll(async () => {
    // Connect to test database if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    
    // Delete test user if exists
    await User.deleteOne({ email: testUser.email });
  });
  
  afterAll(async () => {
    // Clean up test data
    await User.deleteOne({ email: testUser.email });
    
    // Close database connection
    await mongoose.connection.close();
  });
  
  describe('POST /api/auth/register', () => {
    it('should register a new user and return user data with token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect('Content-Type', /json/)
        .expect(201);
      
      // Check response structure and data
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data).toHaveProperty('token');
      
      // Verify user data (sanitized - no password)
      expect(res.body.data.user).toHaveProperty('name', testUser.name);
      expect(res.body.data.user).toHaveProperty('email', testUser.email);
      expect(res.body.data.user).not.toHaveProperty('password');
    });
    
    it('should return 409 if user already exists', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect('Content-Type', /json/)
        .expect(409);
      
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error.message).toContain('already exists');
    });
    
    it('should return validation errors for invalid inputs', async () => {
      const invalidUser = {
        name: 'Test',
        email: 'not-an-email',
        password: '123',  // Too short
        confirmPassword: '456'  // Does not match
      };
      
      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(res.body).toHaveProperty('success', false);
    });
  });
  
  describe('POST /api/auth/login', () => {
    it('should login existing user and return user data with token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Check response structure and data
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'Login successful');
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data).toHaveProperty('token');
      
      // Verify user data (sanitized - no password)
      expect(res.body.data.user).toHaveProperty('name', testUser.name);
      expect(res.body.data.user).toHaveProperty('email', testUser.email);
      expect(res.body.data.user).not.toHaveProperty('password');
    });
    
    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!'
        })
        .expect('Content-Type', /json/)
        .expect(401);
      
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error.message).toContain('Invalid email or password');
    });
    
    it('should return 401 for non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        })
        .expect('Content-Type', /json/)
        .expect(401);
      
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error.message).toContain('Invalid email or password');
    });
  });
  
  describe('GET /api/auth/me', () => {
    let token;
    
    // Login first to get token
    beforeAll(async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      token = res.body.data.token;
    });
    
    it('should return current user data with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user).toHaveProperty('email', testUser.email);
    });
    
    it('should return 401 with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken')
        .expect('Content-Type', /json/)
        .expect(401);
      
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error.message).toContain('Not authorized');
    });
    
    it('should return 401 with missing token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .expect('Content-Type', /json/)
        .expect(401);
      
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error.message).toContain('Not authorized');
    });
  });
});