# Rec Hub Deployment Guide

Complete guide to deploying Rec Hub to production.

## Pre-Deployment Checklist

- [ ] Change `JWT_SECRET` to a secure random value
- [ ] Update `PUBLIC_BASE_DOMAIN` to your domain
- [ ] Set up production PostgreSQL database (recommended: AWS RDS, Heroku Postgres)
- [ ] Set up production Redis instance (recommended: AWS ElastiCache, Heroku Redis)
- [ ] Configure S3 or MinIO for production media storage
- [ ] Set up SMTP for email (SendGrid, AWS SES, Mailgun)
- [ ] Configure DNS records for your domain
- [ ] Set up SSL/TLS certificates (Let's Encrypt recommended)
- [ ] Configure backup strategy for database and files
- [ ] Set up monitoring and logging
- [ ] Load test before going live

## Environment Variables

Create `.env.prod` with production values:

```bash
# Database
POSTGRES_URL=postgres://user:pass@prod-db.aws.rds.amazonaws.com:5432/rec?sslmode=require

# Redis
REDIS_URL=redis://user:pass@prod-redis.elasticache.amazonaws.com:6379

# Media Storage
MINIO_ENDPOINT=https://s3.amazonaws.com
MINIO_ACCESS_KEY=your-aws-access-key
MINIO_SECRET_KEY=your-aws-secret-key

# Authentication
JWT_SECRET=<generate-with-openssl-rand-hex-32>

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
FROM_EMAIL=noreply@yourdomain.com

# Server
PORT=8000
PUBLIC_BASE_DOMAIN=yourdomain.com
GIN_MODE=release
```

Generate a secure JWT secret:
```bash
openssl rand -hex 32
```

## Docker Deployment

### Build Images

```bash
docker build -t rec-hub-backend:latest apps/backend/
docker build -t rec-hub-frontend:latest apps/frontend/
```

### Production docker-compose.yml

```yaml
version: '3.9'

services:
  backend:
    image: rec-hub-backend:latest
    environment:
      POSTGRES_URL: ${POSTGRES_URL}
      REDIS_URL: ${REDIS_URL}
      JWT_SECRET: ${JWT_SECRET}
      SMTP_HOST: ${SMTP_HOST}
      SMTP_PORT: ${SMTP_PORT}
      FROM_EMAIL: ${FROM_EMAIL}
      PUBLIC_BASE_DOMAIN: ${PUBLIC_BASE_DOMAIN}
      GIN_MODE: release
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis
    restart: always
    networks:
      - rec-network

  frontend:
    image: rec-hub-frontend:latest
    environment:
      VITE_API_BASE_URL: https://api.yourdomain.com
    ports:
      - "5173:5173"
    depends_on:
      - backend
    restart: always
    networks:
      - rec-network

  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: rec
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always
    networks:
      - rec-network

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: always
    networks:
      - rec-network

volumes:
  postgres_data:
  redis_data:

networks:
  rec-network:
```

## Kubernetes Deployment

### Backend Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rec-hub-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: rec-hub-backend
  template:
    metadata:
      labels:
        app: rec-hub-backend
    spec:
      containers:
      - name: backend
        image: rec-hub-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: POSTGRES_URL
          valueFrom:
            secretKeyRef:
              name: rec-hub-secrets
              key: postgres-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: rec-hub-secrets
              key: redis-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: rec-hub-secrets
              key: jwt-secret
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 10
```

### Frontend Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rec-hub-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: rec-hub-frontend
  template:
    metadata:
      labels:
        app: rec-hub-frontend
    spec:
      containers:
      - name: frontend
        image: rec-hub-frontend:latest
        ports:
        - containerPort: 5173
        resources:
          requests:
            cpu: 50m
            memory: 64Mi
          limits:
            cpu: 200m
            memory: 256Mi
```

## Nginx/Traefik Configuration

### Traefik Production Config

```yaml
entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entrypoints:
          to: websecure
          scheme: https
  websecure:
    address: ":443"

certificatesResolvers:
  le:
    acme:
      email: letsencrypt@yourdomain.com
      storage: acme.json
      httpChallenge:
        entrypoint: web

http:
  routers:
    backend:
      rule: "Host(`api.yourdomain.com`)"
      entrypoints:
        - websecure
      service: backend
      tls:
        certResolver: le

    frontend:
      rule: "HostRegexp(`{subdomain:.+}.yourdomain.com`) || Host(`yourdomain.com`)"
      entrypoints:
        - websecure
      service: frontend
      tls:
        certResolver: le

  services:
    backend:
      loadBalancer:
        servers:
        - url: "http://backend:8000"

    frontend:
      loadBalancer:
        servers:
        - url: "http://frontend:5173"
```

## Database Migrations

Before deployment, run migrations:

```bash
docker-compose -f docker-compose.prod.yml run --rm backend go run ./cmd/migrate/main.go
```

Or use a migration job in Kubernetes:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: rec-hub-migrate
spec:
  template:
    spec:
      containers:
      - name: migrate
        image: rec-hub-backend:latest
        command: ["go", "run", "./cmd/migrate/main.go"]
        env:
        - name: POSTGRES_URL
          valueFrom:
            secretKeyRef:
              name: rec-hub-secrets
              key: postgres-url
      restartPolicy: Never
```

## Monitoring & Logging

### Prometheus Metrics

Add to backend to expose metrics:

```go
import "github.com/prometheus/client_golang/prometheus/promhttp"

router.GET("/metrics", gin.WrapF(promhttp.Handler().ServeHTTP))
```

### ELK Stack

For centralized logging:

```yaml
filebeat:
  inputs:
  - type: docker
    containers:
      ids: ["*"]
      stream: all

output:
  elasticsearch:
    hosts: ["elasticsearch:9200"]
```

### Application Monitoring

Monitor key metrics:
- Request latency (p50, p95, p99)
- Error rates
- Database connection pool usage
- Redis memory usage
- CPU and memory utilization

## Backup Strategy

### Database Backups

Automated daily backups:

```bash
# AWS RDS automatic backups (recommended)
# Or use pg_dump:
pg_dump postgres://user:pass@db:5432/rec > backup.sql

# Restore:
psql postgres://user:pass@db:5432/rec < backup.sql
```

### File Backups

For MinIO/S3:
- Enable versioning
- Set up lifecycle policies for old versions
- Regular sync to secondary storage

### Backup Testing

Test restores monthly to ensure backups are working.

## Security Considerations

### HTTPS/TLS

- Use Let's Encrypt for SSL certificates
- Set HSTS header: `Strict-Transport-Security: max-age=31536000`
- Enable certificate pinning for API clients

### Database Security

- Use strong passwords (32+ characters)
- Enable SSL connections
- Restrict network access (security groups)
- Use VPC/private subnets

### API Security

- Rate limiting on all endpoints
- CORS configured to allowed domains only
- Input validation on all endpoints
- Output sanitization (especially HTML)
- CSRF protection for state-changing requests

### Environment Secrets

Never commit secrets to git:

```bash
# Use environment variables
export JWT_SECRET=$(openssl rand -hex 32)
export DB_PASSWORD=$(openssl rand -base64 32)

# Or use secret management:
# - AWS Secrets Manager
# - HashiCorp Vault
# - Kubernetes Secrets
```

## Scaling

### Horizontal Scaling

The architecture supports horizontal scaling:

```bash
# Multiple backend instances behind load balancer
# Multiple frontend instances with static content caching
# PostgreSQL read replicas for read-heavy workloads
```

### Caching Strategy

- Redis: Session cache, rate limiting
- CDN: Frontend assets, static files
- Database query caching for frequently accessed data

### Performance Optimization

1. Enable gzip compression on Nginx/Traefik
2. Set cache headers appropriately:
   ```
   Cache-Control: public, max-age=3600
   ETag: <hash>
   ```
3. Minimize database queries (use indexes)
4. Image optimization and responsive sizes
5. Code splitting in frontend

## Post-Deployment

### Smoke Tests

```bash
# Test auth
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.local", "password": "test"}'

# Test public site
curl https://yourdomain.com/api/public/sitemap.xml
```

### Monitoring First 24 Hours

- Error rates
- Response times
- Database connections
- Memory/CPU usage
- Email delivery status

### Gradual Rollout

1. Deploy to staging environment
2. Run integration tests
3. Perform load testing
4. Blue-green deployment to production
5. Monitor for 24 hours
6. Roll back if issues detected

## Maintenance

### Regular Tasks

- **Daily**: Monitor logs and metrics
- **Weekly**: Review security logs
- **Monthly**: Test backup restoration
- **Quarterly**: Security audits
- **Yearly**: Dependency updates

### Updates

Keep dependencies updated:

```bash
# Backend
go get -u ./...
go mod tidy

# Frontend
npm outdated
npm update
```

## Support & Issues

For deployment issues:
1. Check logs: `docker-compose logs -f`
2. Verify environment variables
3. Test database connectivity
4. Check firewall rules
5. Review application logs
