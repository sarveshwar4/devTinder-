#DevTinder Backend 
Overview
DevTinder is a MERN-stack web app that helps developers connect and collaborate — kind of like Tinder, but for devs!
This repo contains the backend, built using Node.js, Express, and MongoDB. It follows a microservices-friendly structure, making it easy to scale later.

The backend is fully working and ready for further upgrades!

Tech Stack Used
Backend: Node.js + Express.js

Database: MongoDB with Mongoose

Authentication: JWT + Cookies

Encryption: bcryptjs

Testing: Postman

Environment: dotenv

Package Manager: npm

#Features
1. User Authentication
Signup, Login, Logout

Secure cookies and JWT-based auth

Passwords are encrypted using bcryptjs

Middleware to protect routes

2. User Profiles
View and edit your profile

Update password with checks

3. Connection Requests
Send requests (Interested / Ignored)

Accept or reject requests

No duplicate or self-requests (handled via validation)

4. Feed & Pagination
Get suggestions (excluding yourself, connections, ignored users, etc.)

Pagination with skip and limit

Efficient queries using MongoDB operators

5. Database Design
Clean and validated User and ConnectionRequest schemas

Unique email/username

Indexed fields for better performance

6. Middleware
Auth middleware to protect APIs

Error handling

Mongoose middleware for pre-save hooks

7. Express Routing
Organized routes for auth, profile, connections, and users

