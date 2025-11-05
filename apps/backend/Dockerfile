FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk update && apk add --no-cache git

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o bin/server ./cmd/server

# Final stage - use golang image instead of alpine to have Go available
FROM golang:1.23-alpine

RUN apk update && apk add --no-cache ca-certificates git

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/bin/server .

# Copy migrations
COPY migrations ./migrations

# Copy source code for running migrations and other Go commands
COPY --from=builder /app/cmd ./cmd
COPY --from=builder /app/pkg ./pkg
COPY --from=builder /app/go.mod ./go.mod
COPY --from=builder /app/go.sum ./go.sum

EXPOSE 8000

CMD ["./server"]
