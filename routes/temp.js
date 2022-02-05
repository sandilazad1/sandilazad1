const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Temp = require("../models/temp");

router.post("/", async (req, res) => {
  const io = req.app.get("io");
  let isExists = await Temp.find({
    woodId: req.body.woodId,
    isDisabled: false,
  }).countDocuments();

  if (isExists) {
    const data = await Temp.updateOne(
      { woodId: req.body.woodId },
      {
        $push: {
          sensorData: {
            temp: req.body.temp,
            date: new Date(),
          },
        },
      }
    );

    if (data.n === 0) {
      return res.send({
        isExecuted: false,
        data: {},
        message: "Not Updated",
      });
    }
    if (data.nModified === 0) {
      return res.send({
        isExecuted: false,
        data: {},
        message: "Not Updated",
      });
    }

    await io.emit("newTempAdded");
    return res.send({
      isExecuted: true,
      data: {},
      message: "Updated temp",
    });
  } else {
    const data = await Temp.updateMany(
      {
        isDisabled: false,
      },
      {
        $set: {
          isDisabled: true,
        },
      }
    );
    // if (data.n === 0) {
    //   return res.send({
    //     isExecuted: false,
    //     data: {},
    //     message: 'Not Created due to exixting one updated (n)'
    //   })
    // }
    // if (data.nModified === 0) {
    //   return res.send({
    //     isExecuted: false,
    //     data: {},
    //     message: 'Not Created due to exixting one updated (nModified)'
    //   })
    // }
    const temp = new Temp({
      woodId: req.body.woodId,
      serialNo:
        "SL-" + (await Temp.countDocuments()|| 1).toString().padStart(6, "0"),
      isDisabled: false,
      sensorData: [
        {
          temp: req.body.temp,
          date: new Date(),
        },
      ],
    });
    await temp
      .save()
      .then(() => {
        io.emit("newTempAdded");
        return res.send({
          isExecuted: true,
          data: temp,
          message: "Created for New Wood",
        });
      })
      .catch((err) => {
        return res.send({
          isExecuted: false,
          data: {},
          message: err.message,
        });
      });
  }
});

router.get("/", (req, res) => {
  Temp.find(
    { isDisabled: false },
    { _id: 0, woodId: 1, serialNo: 1, sensorData: { temp: 1, date: 1 } }
  )
    .then((temps) => {
      return res.send({
        isExecuted: true,
        data: temps,
      });
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
