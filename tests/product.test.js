const request = require('supertest');
const app = require('../server'); // Make sure server.js exports the app
const chai = require('chai');
const expect = chai.expect;

describe('Product APIs', () => {
  it('should add a product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODQ1NDc0NTQ0NzUwZmNmY2RkYTFiNWQiLCJlbWFpbCI6InBoYWRuaXNhbmFuZGh5ZEBnbWFpbC5jb20iLCJpYXQiOjE3NDkzNzA3NTAsImV4cCI6MTc0OTM3NDM1MH0.VDsAg4OpeZC4Q_0tff3AmOZcZE8QQtBuJkqpZj3P1UU')
      .field('productName', 'Test Product')
      .field('productExpiryDate', '2026-12-31')
      .field('totalProductQuantity', 10)
      .attach('productImage', 'tests/test_image.png');
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('productName', 'Test Product');
  });

  it('should get product by ID', async () => {
    const res = await request(app).get('/api/products/1').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODQ1NDc0NTQ0NzUwZmNmY2RkYTFiNWQiLCJlbWFpbCI6InBoYWRuaXNhbmFuZGh5ZEBnbWFpbC5jb20iLCJpYXQiOjE3NDkzNzA3NTAsImV4cCI6MTc0OTM3NDM1MH0.VDsAg4OpeZC4Q_0tff3AmOZcZE8QQtBuJkqpZj3P1UU');
    expect(res.status).to.equal(200);
  });

  it('should soft delete product', async () => {
    const res = await request(app).delete('/api/products/1').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODQ1NDc0NTQ0NzUwZmNmY2RkYTFiNWQiLCJlbWFpbCI6InBoYWRuaXNhbmFuZGh5ZEBnbWFpbC5jb20iLCJpYXQiOjE3NDkzNzA3NTAsImV4cCI6MTc0OTM3NDM1MH0.VDsAg4OpeZC4Q_0tff3AmOZcZE8QQtBuJkqpZj3P1UU');
    expect(res.status).to.equal(200);
  });
});