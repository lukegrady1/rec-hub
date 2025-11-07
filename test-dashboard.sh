#!/bin/bash

# Login and get token
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Domain: demo.local.rechub" \
  -d '{"email":"admin@demo.local","password":"demo123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Testing Dashboard API Endpoints"
echo "================================"
echo

echo "1. Dashboard Summary:"
curl -s http://localhost:8000/api/admin/dashboard/summary \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-Domain: demo.local.rechub" | python -m json.tool
echo

echo "2. Upcoming Events:"
curl -s http://localhost:8000/api/admin/dashboard/upcoming-events \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-Domain: demo.local.rechub" | python -m json.tool
echo

echo "3. Recent Bookings:"
curl -s http://localhost:8000/api/admin/dashboard/recent-bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-Domain: demo.local.rechub" | python -m json.tool
echo

echo "4. Utilization Series:"
curl -s http://localhost:8000/api/admin/dashboard/utilization-series \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-Domain: demo.local.rechub" | python -m json.tool
echo

echo "5. Onboarding Status:"
curl -s http://localhost:8000/api/admin/onboarding \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-Domain: demo.local.rechub" | python -m json.tool
