# Rec Hub API Reference

Complete REST API documentation for Rec Hub backend.

## Base URL

- Development: `http://api.local.rechub`
- Production: `https://api.yourdomain.com`

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

## Auth Endpoints

### Register

Creates a new tenant and user account.

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "email": "admin@mydept.local",
  "password": "SecurePass123!",
  "department_name": "My City Recreation",
  "department_slug": "mycity"
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440001",
  "email": "admin@mydept.local"
}
```

### Login

Authenticates user and returns JWT token.

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "admin@mydept.local",
  "password": "SecurePass123!"
}
```

**Response:** (same as Register)

## Pages

### List Pages

**Endpoint:** `GET /api/pages`

**Headers:** Requires authentication

**Response:**
```json
{
  "pages": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440001",
      "slug": "home",
      "title": "Home",
      "meta": {
        "description": "Welcome to our site"
      },
      "published": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Page

**Endpoint:** `POST /api/pages`

**Headers:** Requires authentication

**Request:**
```json
{
  "slug": "about",
  "title": "About Us",
  "meta": {
    "description": "Learn about our recreation department"
  },
  "published": false
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440001",
  "slug": "about",
  "title": "About Us",
  "published": false
}
```

### Update Page

**Endpoint:** `PUT /api/pages/:id`

**Headers:** Requires authentication

**Request:** (same fields as Create)

**Response:**
```json
{
  "success": true
}
```

### Delete Page

**Endpoint:** `DELETE /api/pages/:id`

**Headers:** Requires authentication

**Response:** `204 No Content`

## Blocks

### Create Block

**Endpoint:** `POST /api/blocks`

**Headers:** Requires authentication

**Request:**
```json
{
  "page_id": "550e8400-e29b-41d4-a716-446655440000",
  "kind": "hero",
  "order": 1,
  "config": {
    "headline": "Welcome",
    "subheadline": "To our site",
    "ctaText": "Get Started",
    "ctaHref": "/programs",
    "overlayOpacity": 0.4,
    "align": "center"
  }
}
```

**Supported Block Types:**

- `hero` - Large hero section with CTA
- `rich_text` - HTML rich text content
- `program_grid` - Grid of programs
- `event_list` - List of events
- `facility_grid` - Grid of facilities
- `cta` - Call-to-action button

### Update Block

**Endpoint:** `PUT /api/blocks/:id`

**Headers:** Requires authentication

**Request:** (same as Create)

### Delete Block

**Endpoint:** `DELETE /api/blocks/:id`

**Headers:** Requires authentication

**Response:** `204 No Content`

## Programs

### List Programs

**Endpoint:** `GET /api/programs`

**Headers:** Requires authentication

**Query Parameters:**
- `status` (optional): active, archived

**Response:**
```json
{
  "programs": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Youth Soccer",
      "description": "Fun soccer for ages 5-12",
      "season": "Fall 2024",
      "price_cents": 10000,
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Program

**Endpoint:** `POST /api/programs`

**Headers:** Requires authentication

**Request:**
```json
{
  "title": "Youth Soccer",
  "description": "Fun soccer for ages 5-12",
  "season": "Fall 2024",
  "price_cents": 10000
}
```

### Update Program

**Endpoint:** `PUT /api/programs/:id`

**Headers:** Requires authentication

### Delete Program

**Endpoint:** `DELETE /api/programs/:id`

**Headers:** Requires authentication

**Response:** `204 No Content`

## Events

### List Events

**Endpoint:** `GET /api/events`

**Headers:** Requires authentication

**Response:**
```json
{
  "events": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Community Sports Day",
      "description": "Fun day with sports activities",
      "starts_at": "2024-12-15T10:00:00Z",
      "ends_at": "2024-12-15T14:00:00Z",
      "location": "Central Park",
      "capacity": 200,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Event

**Endpoint:** `POST /api/events`

**Headers:** Requires authentication

**Request:**
```json
{
  "title": "Community Sports Day",
  "description": "Fun day with sports activities",
  "starts_at": "2024-12-15T10:00:00Z",
  "ends_at": "2024-12-15T14:00:00Z",
  "location": "Central Park",
  "capacity": 200
}
```

### Update Event

**Endpoint:** `PUT /api/events/:id`

**Headers:** Requires authentication

### Delete Event

**Endpoint:** `DELETE /api/events/:id`

**Headers:** Requires authentication

## Facilities

### List Facilities

**Endpoint:** `GET /api/facilities`

**Headers:** Requires authentication

**Response:**
```json
{
  "facilities": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Main Gymnasium",
      "type": "gym",
      "address": "123 Recreation St",
      "rules": "No outside shoes. Must be member.",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Facility

**Endpoint:** `POST /api/facilities`

**Headers:** Requires authentication

**Request:**
```json
{
  "name": "Main Gymnasium",
  "type": "gym",
  "address": "123 Recreation St",
  "rules": "No outside shoes. Must be member."
}
```

### Update Facility

**Endpoint:** `PUT /api/facilities/:id`

**Headers:** Requires authentication

### Delete Facility

**Endpoint:** `DELETE /api/facilities/:id`

**Headers:** Requires authentication

## Facility Slots

### List Slots

**Endpoint:** `GET /api/facility-slots`

**Headers:** Requires authentication

**Query Parameters:**
- `facility_id` (optional): Filter by facility

**Response:**
```json
{
  "slots": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "facility_id": "550e8400-e29b-41d4-a716-446655440001",
      "starts_at": "2024-12-15T10:00:00Z",
      "ends_at": "2024-12-15T11:00:00Z",
      "status": "open",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Slot

**Endpoint:** `POST /api/facility-slots`

**Headers:** Requires authentication

**Request:**
```json
{
  "facility_id": "550e8400-e29b-41d4-a716-446655440001",
  "starts_at": "2024-12-15T10:00:00Z",
  "ends_at": "2024-12-15T11:00:00Z"
}
```

### Update Slot

**Endpoint:** `PUT /api/facility-slots/:id`

**Headers:** Requires authentication

### Delete Slot

**Endpoint:** `DELETE /api/facility-slots/:id`

**Headers:** Requires authentication

## Bookings

### List Bookings (Admin)

**Endpoint:** `GET /api/bookings`

**Headers:** Requires authentication

**Response:**
```json
{
  "bookings": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "resource_type": "facility_slot",
      "resource_id": "550e8400-e29b-41d4-a716-446655440001",
      "requester_name": "John Doe",
      "requester_email": "john@example.com",
      "status": "pending",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Update Booking Status (Admin)

**Endpoint:** `PUT /api/bookings/:id`

**Headers:** Requires authentication

**Request:**
```json
{
  "status": "approved"
}
```

**Status Values:** `pending`, `approved`, `declined`, `cancelled`

### Create Booking (Public)

**Endpoint:** `POST /api/public/bookings`

**Headers:** No authentication required

**Request:**
```json
{
  "resource_type": "facility_slot",
  "resource_id": "550e8400-e29b-41d4-a716-446655440001",
  "requester_name": "John Doe",
  "requester_email": "john@example.com",
  "notes": "Need for my family reunion"
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Public Endpoints

### Get Page

**Endpoint:** `GET /api/public/pages/:slug`

**Example:** `GET /api/public/pages/home`

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "slug": "home",
  "title": "Home",
  "blocks": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "kind": "hero",
      "order": 1,
      "config": { }
    }
  ]
}
```

### Get Programs

**Endpoint:** `GET /api/public/programs`

**Response:** Same as list programs endpoint

### Get Upcoming Events

**Endpoint:** `GET /api/public/events/upcoming`

**Response:** Same as list events endpoint

### Get Facilities

**Endpoint:** `GET /api/public/facilities`

**Response:**
```json
{
  "facilities": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Main Gymnasium",
      "type": "gym",
      "address": "123 Recreation St",
      "available_slots": 5
    }
  ]
}
```

## Media

### Presign Upload

**Endpoint:** `POST /api/media/presign`

**Headers:** Requires authentication

**Request:**
```json
{
  "filename": "logo.png",
  "mime_type": "image/png"
}
```

**Response:**
```json
{
  "upload_url": "https://minio.example.com/bucket/...",
  "media_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Get Media Asset

**Endpoint:** `GET /api/media/:id`

**Headers:** Requires authentication

## Error Handling

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common HTTP Status Codes:
- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Success, no content
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Not permitted
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Rate Limiting

Auth endpoints are rate limited:
- 10 requests per minute per IP

## CORS

All endpoints support CORS. Frontend can make requests from any origin in development mode.
