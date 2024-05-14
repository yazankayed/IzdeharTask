// const jwt = require("jsonwebtoken");

// let lastActivity = {}; // Track last activity time for each user

// module.exports.authenticate = (request, response, next) => {
//     jwt.verify(request.cookies.usertoken, process.env.SECRET_KEY, (err, payload) => {
//         if (err) {
//             response.status(401).json({ verified: false });
//         } else {
//             // Update last activity time for the user
//             const userId = payload.id;
//             lastActivity[userId] = Date.now();

//             if (request.body.description) {
//                 request.body.requester = payload.id;
//             }
//             next();
//         }
//     });
// }

// // Middleware to check and logout if inactive
// module.exports.checkActivity = (request, response, next) => {
//     const userId = request.user.id; // Assuming you have user data attached to request
//     const now = Date.now();
//     if (lastActivity[userId] && (now - lastActivity[userId]) > (5 * 60 * 1000)) { // 5 minutes in milliseconds
//         // Clear cookie and respond with logout status
//         response.clearCookie('usertoken');
//         return response.status(401).json({ message: 'Automatic logout due to inactivity' });
//     }
//     next();
// }

const jwt = require("jsonwebtoken");

let lastActivity = {}; // Track last activity time for each user

module.exports.authenticate = (request, response, next) => {
  const token = request.cookies.usertoken;

  if (!token) {
    return response
      .status(401)
      .json({ verified: false, message: "No token provided" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      return response
        .status(401)
        .json({ verified: false, message: "Token verification failed" });
    }

    // Update last activity time for the user
    const userId = payload.id;
    lastActivity[userId] = Date.now();

    if (request.body.description) {
      request.body.requester = payload.id;
    }

    next();
  });
};

// Middleware to check and logout if inactive
module.exports.checkActivity = (request, response, next) => {
  const token = request.cookies.usertoken;

  if (!token) {
    return response
      .status(401)
      .json({ message: "Automatic logout due to inactivity" });
  }

  const decodedJwt = jwt.decode(token, { complete: true });

  if (!decodedJwt) {
    return response
      .status(401)
      .json({ message: "Automatic logout due to inactivity" });
  }

  const userId = decodedJwt.payload.id;
  const now = Date.now();

  if (lastActivity[userId] && now - lastActivity[userId] > 5 * 60 * 1000) {
    // 5 minutes in milliseconds
    // Clear cookie and respond with logout status
    response.clearCookie("usertoken");
    return response
      .status(401)
      .json({ message: "Automatic logout due to inactivity" });
  }

  next();
};
