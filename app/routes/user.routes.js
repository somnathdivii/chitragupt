const { authJwt } = require("../middlewares");
const workreport = require("../controllers/workreport.controller.js");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // app.get("/api/test/all", controller.allAccess);

  // app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  // app.get(
  //   "/api/test/mod",
  //   [authJwt.verifyToken, authJwt.isModerator],
  //   controller.moderatorBoard
  // );

  // app.get(
  //   "/api/test/admin",
  //   [authJwt.verifyToken, authJwt.isAdmin],
  //   controller.adminBoard
  // );

  //WORKREPORT routing start  for worker

    // Create a new workreport
    app.post("/api/user/workreport",[authJwt.verifyToken], workreport.create);

    // Retrieve all workreport
    app.get("/api/user/workreport",[authJwt.verifyToken], workreport.findAll);
  
    // Retrieve all published workreport
    app.get("/api/user/workreport/published",[authJwt.verifyToken], workreport.findAllPublished);
  
    // Retrieve a single workreport with id
    app.get("/api/user/workreport/:id",[authJwt.verifyToken], workreport.findOne);
  
    // Update a workreport with id
    app.put("/api/user/workreport/:id",[authJwt.verifyToken], workreport.update);
  
    // Delete a workreport with id
    app.delete("/api/user/workreport/:id",[authJwt.verifyToken], workreport.delete);
  
    // // Delete all workreport
    // app.delete("/api/user/workreport/", workreport.deleteAll);

//WORKREPORT routing end



};
