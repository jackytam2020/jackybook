# JackyBook

[JackyBook](https://jackybook.vercel.app/) is a full stack social media application with full CRUD operations of posts, comments, likes, and friends. It also includes notifications of any interactions your friends have with you!
JackyBook is currently deployed under branch: main-without-socket as real time notifications is still being implemented 

### Tech Stack
<b>Front-End</b>
  * React/NextJS
  * Material UI
  * JavaScript
  * TypeScript
  * SCSS
  * Socket.io
  * Axios
 
<b>Back-End</b>
 * NodeJS
 * ExpressJS
 * CORS
 * JavaScript
 * MongoDB Atlas

### Testing Instructions
To test the full capabilities of the app, I recommend to log in with the following test accounts:

If you would like to run the application locally, follow installation instructions bellow

### Installation 

```
cd client
npm install
```
Add a .env.local file so the front end can be connected to the backend and paste the following code:
```
SERVER=https://jackybook-api.onrender.com
IMAGE_SERVER=jackybook-api.onrender.com
```
