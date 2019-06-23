const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");
const Enterprise = require("../../models/Enterprise");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  console.log("register");

  if (!isValid) {
    return res.send(400, errors);
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return res.status(400).json({ message: "Email already in use" });
      } else {
        if (req.body.CUI) {
          Enterprise.findOne({ CUI: parseInt(req.body.CUI) }).then(enterprise => {
            if (!enterprise) {
              return res.status(400).json({ message: "Enterprise with given UIC not found" });
            } else if (req.body.employeeId) {
              if (!enterprise.employees.includes(parseInt(req.body.employeeId))) {
                return res.status(400).json({
                  message: "Incorrect employee ID for given enterprise"
                });
              } else {
                const newUser = new User({
                  firstname: req.body.firstname,
                  lastname: req.body.lastname,
                  email: req.body.email,
                  password: req.body.password,
                  type: req.body.type
                });

                // Hash password before saving in database

                bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                      .save()
                      .then(user => res.json(user))
                      .catch(err => console.log(err));
                  });
                });
              }
            }
          });
        } else {
          if (req.body.enterpriseId) {
            Enterprise.findOne({
              platformId: parseInt(req.body.enterpriseId)
            }).then(enterprise => {
              if (!enterprise) {
                return res.status(400).json({ message: "Enterprise with given ID not found" });
              } else {
                const newUser = new User({
                  firstname: req.body.firstname,
                  lastname: req.body.lastname,
                  email: req.body.email,
                  password: req.body.password,
                  type: req.body.type
                });

                // Hash password before saving in database

                bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                      .save()
                      .then(user => res.json(user))
                      .catch(err => console.log(err));
                  });
                });
              }
            });
          } else if (req.body.type === "trainer") {
            const newUser = new User({
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              email: req.body.email,
              password: req.body.password,
              type: req.body.type
            });

            // Hash password before saving in database

            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => res.json(user))
                  .catch(err => console.log(err));
              });
            });
          }
        }
      }
    })
    .catch(err => {
      console.log(err);
      return res.send(500, err);
    });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email

  User.findOne({ email })
    .populate("pendingCourses")
    .populate("activeCourses")
    .populate("completedCourses")
    .then(user => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: "Email not found" });
      }
      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user.id,
            name: user.name
          };
          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token,
                user
              });
            }
          );
        } else {
          return res.status(400).json({ message: "Incorrect Password" });
        }
      });
    });
});

// router.get("/logout", function(req, res, next) {
//   console.log(res);
//   if (req.session) {
//     req.session.destroy(function(err) {
//       console.log(err);
//       if (err) {
//         return next(err);
//       } else {
//         return res.redirect("/");
//       }
//     });
//   }
// });

router.get("/logout", (req, res) => {
  req.logout();
});

router.get("/", (req, res) => {
  User.find().then(users => {
    if (users.length === 0) {
      return res.status(404).json({ message: "No user exists" });
    } else {
      return res.status(200).json(users);
    }
  });
});

router.get("/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .populate("pendingCourses")
    .populate("activeCourses")
    .populate("completedCourses")
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      } else {
        return res.status(200).json(user);
      }
    });
});

// router.get("/search/:name", (req, res) => {
//   User.find({ lastname: req.params.name }).then(user => {
//     if (!user) {
//       return res.status(404).json({ message: "No user found" });
//     } else {
//       return res.status(200).json(user);
//     }
//   });
// });

router.get("/search/:type/:name", (req, res) => {
  User.find({
    $or: [
      { lastname: { $regex: new RegExp(req.params.name), $options: "i" } },
      { firstname: { $regex: new RegExp(req.params.name), $options: "i" } }
    ],
    type: req.params.type
  }).then(users => {
    if (users.length === 0) {
      return res.status(404).json({ message: "No user found" });
    } else {
      return res.status(200).json(users);
    }
  });
});

router.delete("/:id", (req, res) => {
  User.findOneAndDelete({ _id: req.params.id }, (err, response) => {
    if (err) {
      res.json(err);
    } else {
      res.status(200).json(response);
    }
  });
});

router.put("/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .then(user => {
      for (let prop of Object.keys(req.body)) {
        if (prop !== "__v") {
          user[prop] = req.body[prop];
        }
      }
      console.log(user);
      user
        .save()
        .then(user => {
          res.json(user);
        })
        .catch(err => {
          res.json(err);
        });
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
