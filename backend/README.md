# Kids Spelling Game - Scalable Backend API

A production-ready Node.js backend with PostgreSQL database designed to handle **thousands of concurrent users**.

## 🎯 **Why PostgreSQL for Large Scale?**

- ✅ **Handles 1000+ concurrent users** with proper configuration
- ✅ **ACID compliance** - guaranteed data integrity
- ✅ **Advanced indexing** - lightning-fast queries
- ✅ **Connection pooling** - efficient resource management
- ✅ **Horizontal scaling** - read replicas for growth
- ✅ **Enterprise-grade security** - perfect for schools

## 🚀 **Quick Setup Options**

### **Option 1: Local Development (PostgreSQL)**
```bash
# 1. Install PostgreSQL locally
# Windows: Download from https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Ubuntu: sudo apt-get install postgresql postgresql-contrib

# 2. Create database
createdb kids_spelling_game

# 3. Install dependencies
cd backend
npm install

# 4. Set environment variables
cp .env.example .env
# Edit .env with your database credentials

# 5. Initialize database
npm run init-db

# 6. Seed with sample data
npm run seed-db

# 7. Start server
npm run dev
```

### **Option 2: Cloud Database (Recommended for Production)**

#### **🌟 AWS RDS PostgreSQL (Recommended)**
```bash
# 1. Create RDS PostgreSQL instance in AWS Console
# 2. Set environment variables:
DB_HOST=your-rds-endpoint.amazonaws.com
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_NAME=kids_spelling_game
DB_PORT=5432
NODE_ENV=production

# 3. Deploy and run
npm start
```

#### **🌟 Google Cloud SQL**
```bash
# 1. Create Cloud SQL PostgreSQL instance
# 2. Set connection details in .env
# 3. Enable Cloud SQL Proxy for secure connections
```

#### **🌟 Heroku Postgres (Easy Setup)**
```bash
# 1. Create Heroku app
heroku create kids-spelling-game-api

# 2. Add Heroku Postgres addon
heroku addons:create heroku-postgresql:hobby-dev

# 3. Deploy
git push heroku main
```

## 📊 **Database Schema (Optimized for Scale)**

### **Core Tables**
- **`users`** - Multi-user support with UUID primary keys
- **`word_families`** - Spelling word categories
- **`words`** - Individual words with difficulty scoring
- **`user_progress`** - Individual word mastery tracking
- **`family_progress`** - Family completion status
- **`user_sessions`** - Session analytics

### **Performance Features**
- **Connection Pooling** - 20 max connections, 5 minimum
- **Optimized Indexes** - Fast queries on all common operations
- **UUID Primary Keys** - Better for distributed systems
- **Automatic Timestamps** - Track all data changes
- **Slow Query Logging** - Monitor performance

## 🔌 **API Endpoints**

### **Word Families**
```
GET    /api/word-families          # Get all families with progress
GET    /api/word-families/:id      # Get specific family
POST   /api/word-families          # Create new family
PUT    /api/word-families/:id      # Update family
DELETE /api/word-families/:id      # Delete family
```

### **User Management**
```
POST   /api/users/register         # Register new user
POST   /api/users/login            # User login
GET    /api/users/profile          # Get user profile
PUT    /api/users/profile          # Update profile
```

### **Progress Tracking**
```
POST   /api/progress/attempt       # Submit spelling attempt
GET    /api/progress/stats         # Get user statistics
GET    /api/progress/family/:id    # Get family progress
GET    /api/progress/leaderboard   # Get class leaderboard
```

### **Analytics**
```
GET    /api/analytics/usage        # Usage statistics
GET    /api/analytics/performance  # Performance metrics
GET    /api/analytics/progress     # Learning progress analytics
```

## 🔧 **Environment Configuration**

Create `.env` file:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=kids_spelling_game
DB_PORT=5432

# Server Configuration
PORT=3000
NODE_ENV=development

# Security
JWT_SECRET=your-super-secret-jwt-key
BCRYPT_ROUNDS=12

# CORS
FRONTEND_URL=http://localhost:4200

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

## 📈 **Performance Optimization**

### **Database Optimizations**
- **Connection Pooling**: 20 max connections for high concurrency
- **Prepared Statements**: Prevent SQL injection, improve performance
- **Indexes**: Optimized for common query patterns
- **Query Monitoring**: Automatic slow query detection

### **Application Optimizations**
- **Compression**: Gzip compression for responses
- **Rate Limiting**: Prevent abuse and ensure fair usage
- **Caching**: Redis integration for session management
- **Load Balancing**: Ready for multiple server instances

## 🛡️ **Security Features**

- **Helmet.js** - Security headers
- **Rate Limiting** - Prevent abuse
- **Input Validation** - Joi schema validation
- **SQL Injection Protection** - Parameterized queries
- **Password Hashing** - bcrypt with salt rounds
- **JWT Authentication** - Secure user sessions
- **CORS Configuration** - Controlled cross-origin access

## 📊 **Monitoring & Analytics**

### **Built-in Metrics**
- User session tracking
- Learning progress analytics
- Performance monitoring
- Error logging
- Database health checks

### **Integration Ready**
- **New Relic** - Application performance monitoring
- **DataDog** - Infrastructure monitoring
- **Sentry** - Error tracking
- **Google Analytics** - User behavior tracking

## 🚀 **Deployment Options**

### **1. Heroku (Easiest)**
```bash
# One-click deployment with Heroku Postgres
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### **2. AWS (Most Scalable)**
```bash
# Use AWS RDS + Elastic Beanstalk
# Supports auto-scaling for thousands of users
```

### **3. Google Cloud (Best for Schools)**
```bash
# Google for Education integration
# Cloud SQL + App Engine
```

### **4. DigitalOcean (Cost-Effective)**
```bash
# Managed PostgreSQL + App Platform
# Great price/performance ratio
```

## 📚 **Sample Data**

The database comes pre-seeded with:
- **5 Word Families**: AT, AN, ING, OP, UG
- **40+ Words** with example sentences
- **Difficulty Progression**: Easy → Medium → Hard
- **Grade Level Mapping**: K-3 appropriate content

## 🔄 **Database Management**

### **Migrations**
```bash
npm run migrate          # Run database migrations
npm run migrate:rollback # Rollback last migration
```

### **Backup & Restore**
```bash
# Backup
pg_dump kids_spelling_game > backup.sql

# Restore
psql kids_spelling_game < backup.sql
```

### **Performance Monitoring**
```bash
# Check slow queries
npm run analyze:queries

# Database health check
curl http://localhost:3000/api/health
```

## 🎓 **Educational Features**

- **Adaptive Learning** - Difficulty adjusts to student progress
- **Progress Tracking** - Detailed analytics for teachers
- **Multi-User Support** - Classroom management
- **Session Analytics** - Learning time tracking
- **Achievement System** - Gamification elements

## 🤝 **Integration with Angular Frontend**

The backend provides a complete REST API that your Angular app can consume. Update your Angular services to use these endpoints for:

- User authentication
- Progress tracking
- Real-time analytics
- Multi-user support

## 📞 **Support & Scaling**

For production deployment supporting **1000+ concurrent users**:

1. **Database**: Use managed PostgreSQL (AWS RDS, Google Cloud SQL)
2. **Application**: Deploy on multiple instances with load balancer
3. **Caching**: Add Redis for session management
4. **Monitoring**: Implement comprehensive logging and alerts
5. **CDN**: Use CloudFront or CloudFlare for static assets

This architecture can easily scale to support entire school districts! 🏫 