const express = require("express");
const router = express.Router();
const Request = require("../../models/Request");

router.get("/:type/:id", (req, res) => {
  Request.find({ [req.params.type]: req.params.id })
    .populate("employee")
    .populate("course", "name")
    .populate("sender")
    .populate("receiver")
    .then(requests => {
      return res.status(200).json(requests);
    })
    .catch(err => {
      return res.status(500).json(err);
    });
});

router.get("/", (req, res) => {
  Request.find()
    .populate("employee")
    .populate("course", "name")
    .populate("sender")
    .populate("receiver")
    .then(requests => {
      return res.status(200).json(requests);
    })
    .catch(err => {
      return res.status(500).json(err);
    });
});

// router.get("/:id", (req, res) => {
//   Request.findOne({ _id: req.params.id }).then(request => {
//     if (!request) {
//       return res.status(404).json({ requestNotFound: "Request not found" });
//     } else {
//       return res.status(200).json(request);
//     }
//   });
// });

router.delete("/:id", (req, res) => {
  Request.findOneAndDelete({ _id: req.params.id }, (err, response) => {
    if (err) {
      res.json(err);
    } else {
      res.status(200).json(response);
    }
  });
});

router.post("/", (req, res) => {
  const newRequest = new Request({
    employee: req.body.employee,
    course: req.body.course,
    module: req.body.module,
    sender: req.body.sender,
    receiver: req.body.receiver,
    addedOn: req.body.addedOn
  });
  newRequest
    .save()
    .then(request => res.json(request))
    .catch(err => {
      res.json(err);
    });
});

// router.put("/:id", (req, res) => {
//   Request.findOne({ _id: req.params.id }).then(request => {
//     request.name = req.body.name;
//     request.category = req.body.category;
//     request.modules = req.body.modules;
//     request.report = req.body.report;
//     request.addedBy = req.body.addedBy;
//     request
//       .save()
//       .then(request => res.json(request))
//       .catch(err => {
//         res.json(err);
//       });
//   });
// });

module.exports = router;
