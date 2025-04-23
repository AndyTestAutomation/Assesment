// const cookies: { [key: string]: string }; // Adjust the type as per the actual structure of cookies

const cookiesArray = [
  {
    "name": "_octo",
    "value": "GH1.1.1120334041.1744905774",
    "domain": ".github.com",
    "path": "/",
    "expires": 1776441788.630702,
    "httpOnly": false,
    "secure": true,
    "sameSite": "Lax"
  },
  {
    "name": "cpu_bucket",
    "value": "xlg",
    "domain": ".github.com",
    "path": "/",
    "expires": -1,
    "httpOnly": false,
    "secure": true,
    "sameSite": "Lax"
  },
  // ... (rest of the cookies)
];

// Convert the array of cookies into an object with key-value pairs
const cookiesObject = {};
cookiesArray.forEach(cookie => {
  cookiesObject[cookie.name] = cookie.value;
});

export default cookiesObject;
