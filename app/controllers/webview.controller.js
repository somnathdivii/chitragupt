const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const d = new Date();
const month = d.getMonth() + 1;
const day = d.getDate();
const date = d.getFullYear() + '/' +
  (('' + month).length < 2 ? '0' : '') + month + '/' +
  (('' + day).length < 2 ? '0' : '') + day;

var pageTitle = '';


exports.signupweb = async (req, res) => {

  var personInfo = req.body;

  if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf) {
    res.send();
  } else {


    if (personInfo.password == personInfo.passwordConf) {

      // 	User.findOne({ email: personInfo.email }, function (err, data) {
      User.findOne({ email: personInfo.email }, function (err, data) {

        if (!data) {

          User.findOne({ username: personInfo.username }, async (err, data) => {
            if (!data) {

              const password = await bcrypt.hashSync(req.body.password, 8);

              const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: password
              });

              user.save((err, user) => {
                console.log(user);
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }

                if (req.body.roles) {
                  Role.find(
                    {
                      name: { $in: req.body.roles }
                    },
                    (err, roles) => {
                      if (err) {
                        res.status(500).send({ message: err });
                        return;
                      }

                      user.roles = roles.map(role => role._id);
                      user.save(err => {
                        if (err) {
                          res.status(500).send({ message: err });
                          return;
                        }

                        res.send({ "Success": "You are regestered,You can login now." });
                      });
                    }
                  );
                } else {
                  Role.findOne({ name: "user" }, (err, role) => {
                    if (err) {
                      res.status(500).send({ message: err });
                      return;
                    }

                    user.roles = [role._id];
                    console.log(user);
                    user.save(err => {
                      if (err) {
                        res.status(500).send({ message: err });
                        return;
                      }
                      res.send({ "Success": "You are regestered,You can login now." });
                      // res.send({ message: "User was registered successfully!" });
                    });
                  });
                }
              });

             // res.send({ "Success": "You are regestered,You can login now." });
            } else {
              res.send({ "Success": "Username is already used." });
            }
          });

        } else {
          res.send({ "Success": "Email is already used." });
        }

      });

    } else {
      res.send({ "Success": "password is not matched" });
    }


  }

};

exports.signinweb = async (req, res) => {

  User.findOne({
    username: req.body.username
  }).populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.send({ "Success": "This username Is not regestered!" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.send({ "Success": "Wrong password!" });
        // return res.status(401).send({
        //   accessToken: null,
        //   message: "Invalid Password!"
        // });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 604800 // 1 week :)
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      req.session.userId = user._id;
      req.session.access = user.roles[0].name;
      res.status(200).send({ "Success": "Success!" });
      // return res.send({ "Success": "Success!" });
    });
};

exports.dashboard = async (req, res) => {
  console.log(req.session.access);
  User.findOne({ _id: req.session.userId }, function (err, data) {
    console.log(req.session.access);

    if (!data) {
      res.redirect('/');
    } else {
      
      if (req.session.access === 'user') {
        pageTitle = 'Worker Home';
        return res.render('./worker/data.ejs', { "name": data.username, "email": data.email, 'title': pageTitle });
      } else {
        pageTitle = 'Admin Home';
        return res.render('./admin/adminstart.ejs', { "name": data.username, "email": data.email, "date": date, 'title': pageTitle });
      }
    }
  });

};