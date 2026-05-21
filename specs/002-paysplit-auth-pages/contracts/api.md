# API Contracts

## Authentication Endpoints

### 1. Register
- **URL**: `POST /api/auth/register`
- **Purpose**: Create a new user with email and password.
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response** (201 Created):
  - **Headers**: `Set-Cookie: token=<jwt>; HttpOnly; Secure; SameSite=Strict`
  - **Body**:
    ```json
    {
      "message": "User created successfully",
      "user": {
        "id": "123",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
    ```

### 2. Login
- **URL**: `POST /api/auth/login`
- **Purpose**: Authenticate user via email and password.
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response** (200 OK):
  - **Headers**: `Set-Cookie: token=<jwt>; HttpOnly; Secure; SameSite=Strict`
  - **Body**:
    ```json
    {
      "message": "Logged in successfully",
      "user": { ... }
    }
    ```

### 3. Google Login
- **URL**: `POST /api/auth/google`
- **Purpose**: Authenticate user via Google SSO ID token.
- **Request Body**:
  ```json
  {
    "idToken": "eyJhbG..."
  }
  ```
- **Response** (200 OK):
  - **Headers**: `Set-Cookie: token=<jwt>; HttpOnly; Secure; SameSite=Strict`
  - **Body**:
    ```json
    {
      "message": "Logged in successfully",
      "user": { ... }
    }
    ```

### 4. Logout
- **URL**: `POST /api/auth/logout`
- **Purpose**: Clear the authentication cookie.
- **Response** (200 OK):
  - **Headers**: `Set-Cookie: token=; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  - **Body**:
    ```json
    {
      "message": "Logged out successfully"
    }
    ```

### 5. Get Current User
- **URL**: `GET /api/auth/me`
- **Purpose**: Verify session and return the authenticated user's details.
- **Response** (200 OK):
  ```json
  {
    "user": { ... }
  }
  ```
- **Response** (401 Unauthorized) if cookie is missing or invalid.
