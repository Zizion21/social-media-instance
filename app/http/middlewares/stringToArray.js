const stringToArray = function (...args) {
  // ...args: Rest parameter which allows the function to accept any number of arguments and store them in args array
  return function (req, res, next) {
    // A function returning in another function(inner func), commonly used in middlewares
    const fields = args;
    fields.forEach((field) => {
      if (req.body[field]) {
        if (typeof req.body[field] == "string") {
          if (req.body[field].indexOf("#") >= 0) {
            req.body[field] = req.body[field]
              .split("#")
              .map((item) => item.trim());
          } else if (req.body[field].indexOf(",") >= 0) {
            req.body[field] = req.body[field]
              .split(",")
              .map((item) => item.trim());
          } else {
            req.body[field] = [req.body[field]];
          }
        }
        if (Array.isArray(req.body[field])) {
          req.body[field] = req.body[field].map((item) => item.trim());
          req.body[field] = [...new Set(req.body[field])]; // Removes any duplicate items
        }
      } else {
        req.body[field] = [];
      }
    });
    next();
  };
};


module.exports = {
  stringToArray,
};
