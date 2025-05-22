# Book Review API
A RESTful API for managing books and reviews, built with Express.js and MongoDB

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Postman or curl for testing

## Installation
1. Install my-project with npm:
```bash
  git clone https://github.com/TanveshVaity/book_review_api.git
  cd book_review_api
```

2. Install dependancy:
```bash
    npm install
```

3. Create envirnment file:
Create a .env file in the root directory
```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    ACCESS_TOKEN_SECRET=your_jwt_secret
```
4. Running the Application:
Start the server:
```bash
    npm start
```

Development mode with nodemon:
```bash
    npm run dev
```
## API Requests
#### Register User
- endpoint : `POST http://localhost:5000/api/v1/users/register`
- body :
```json
    {
        "username": "tan1",
        "email": "tan1@example.com",
        "password": "tan1"
    }
```
- response :
```json
    {
        "newUser": {
            "username": "tan1",
            "email": "tan1@example.com",
            "password": "$2b$10$glIjxZWeIjmGOHub8hgjouBvHYsHEvIjJJCAYlY..pu3SvAdYFVSK",
            "_id": "682e4d3844d00fcac82f0144",
            "createdAt": "2025-05-21T22:01:28.291Z",
            "updatedAt": "2025-05-21T22:01:28.291Z",
            "__v": 0
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODJlNGQzODQ0ZDAwZmNhYzgyZjAxNDQiLCJ1c2VybmFtZSI6InRhbjEiLCJlbWFpbCI6InRhbjFAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDc4NjQ4ODgsImV4cCI6MTc0Nzk1MTI4OH0.GPB59w1GLwC-GLQNPhCWCxQI1Exh-4YKfrrv1pKAb6Y",
        "message": "User registered successfully"
    }
```

#### Login user
- endpoint : `http://localhost:5000/api/v1/users/login`
- body :
```json
    {
        "email": "tan1@example.com",
        "password": "tan1"
    }
```
- response :
```json
    {
        "existingUser": {
            "_id": "682e4d3844d00fcac82f0144",
            "username": "tan1",
            "email": "tan1@example.com",
            "password": "$2b$10$glIjxZWeIjmGOHub8hgjouBvHYsHEvIjJJCAYlY..pu3SvAdYFVSK",
            "createdAt": "2025-05-21T22:01:28.291Z",
            "updatedAt": "2025-05-21T22:01:28.291Z",
            "__v": 0
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODJlNGQzODQ0ZDAwZmNhYzgyZjAxNDQiLCJ1c2VybmFtZSI6InRhbjEiLCJlbWFpbCI6InRhbjFAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDc5MDUzNDAsImV4cCI6MTc0Nzk5MTc0MH0.b3BZGSxWKfK_kseOoSKhLU0HSnrx_4MUBfL2QjDjsAQ",
        "message": "User logged in successfully"
    }
```

#### Add new book
- endpoint : `POST http://localhost:5000/api/v1/books/add`
- header : `authorization : <access token>`
- body :
```json
    {
        "title": "Ikigai",
        "description": "Happy Life.",
        "author": "Francesc Miralles and Hector Garcia",
        "genre": "Self Help",
        "publishedYear": 2016
    }
```
- response :
```json
    {
        "newBook": {
            "title": "Ikigai",
            "description": "Happy Life.",
            "author": "Francesc Miralles and Hector Garcia",
            "genre": "Self Help",
            "averageRating": 0,
            "publishedYear": 2016,
            "user": "682e4d3844d00fcac82f0144",
            "_id": "682e4f7844d00fcac82f0146",
            "createdAt": "2025-05-21T22:11:04.033Z",
            "updatedAt": "2025-05-21T22:11:04.033Z",
            "__v": 0
        },
        "message": "Book added successfully"
    }
```

#### Get book by id
- endpoint : `GET http://localhost:5000/api/v1/books/:id`
- response :
```json
    {
        "data": {
            "book": {
                "_id": "682d5bb6fd6fa14dd28a7faf",
                "title": "To Kill a Mockingbird",
                "description": "A novel about the serious issues of rape and racial inequality.",
                "author": "Harper Lee",
                "genre": "Fiction",
                "averageRating": "5.00",
                "publishedYear": 1960,
                "user": {
                    "_id": "682d5a30cf878270d8a223ff",
                    "username": "tan"
                },
                "createdAt": "2025-05-21T04:51:02.921Z",
                "updatedAt": "2025-05-21T04:51:02.921Z",
                "__v": 0
            },
            "reviews": {
                "items": [
                    {
                        "_id": "682d6fa39674f89f78e0ae35",
                        "rating": 5,
                        "comment": "An insightful read that delves deep into the complexities of human emotions. Highly recommend!",
                        "user": {
                            "_id": "682d5a30cf878270d8a223ff",
                            "username": "tan"
                        },
                        "createdAt": "2025-05-21T06:16:03.878Z",
                        "updatedAt": "2025-05-21T15:58:46.485Z"
                    }
                ],
                "pagination": {
                    "currentPage": 1,
                    "totalPages": 1,
                    "totalItems": 1,
                    "itemsPerPage": 10
                }
            }
        }
    }
```

#### Add review
- endpoint : `POST http://localhost:5000/api/v1/books/:bookId/reviews`
- header : `authorization : <access token>`
- body :
```json
    {
        "rating": 5,
        "comment": "Geat Book"
    }
```
- response : 
```json
    {
        "review": {
            "rating": 5,
            "comment": "Geat Book",
            "book": "682e4f7844d00fcac82f0146",
            "user": "682e4d3844d00fcac82f0144",
            "_id": "682e54084ae7a82b824e858d",
            "createdAt": "2025-05-21T22:30:32.158Z",
            "updatedAt": "2025-05-21T22:30:32.158Z",
            "__v": 0
        },
        "message": "Review added successfully"
    }
```

## Database schema design
![Database Schema](assets/dbDesign.png)


