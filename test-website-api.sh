#!/bin/bash

# Get token
TOKEN=$(curl -s http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Domain: demo.local.rechub" \
  -d '{"email":"admin@demo.local","password":"demo123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Testing Website Builder API"
echo "============================"
echo

echo "1. Get Website Config:"
curl -s http://localhost:8000/api/website/config \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-Domain: demo.local.rechub" | python -m json.tool
echo
