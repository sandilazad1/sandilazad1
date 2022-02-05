const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/reg", (req, res) => {
  const user = new User({
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    userName: req.body.userName,
    password: req.body.password,
    isDisabled: false,
  });
  user
    .save()
    .then(() => {
      return res.send({
        isExecuted: true,
        data: user,
        message: "Registered !!!",
      });
    })
    .catch((err) => {
      return res.send({
        isExecuted: false,
        data: {},
        message: err.message,
      });
    });
});

router.post("/login", (req, res) => {
  User.findOne(
    {
      userName: req.body.userName,
      password: req.body.password,
      isDisabled: false,
    },
    { _id: 0, name: 1, address: 1, phone: 1 }
  )
    .then((userinfo) => {
      if (userinfo) {
        return res.send({
          isExecuted: true,
          data: {
            isAuthenticated: true,
            userInformation: userinfo,
          },
        });
      } else {
        return res.send({
          isExecuted: false,
          data: {
            isAuthenticated: false,
            userInformation: {},
          },
          error: "Password Incorrect",
        });
      }
    })
    .catch((err) => {
      return res.send({
        isExecuted: false,
        data: {},
        error: err,
      });
    });
});
module.exports = router;
