const express = require("express");
const router = express.Router();
const Feedback = require("../../models/Feedback");

router.get("/", (req, res) => {
  Feedback.find()
    .then(feedbacks => {
      return res.status(200).json(feedbacks);
    })
    .catch(err => {
      return res.status(500).json(err);
    });
});

router.get("/trainer/:id", (req, res) => {
  Feedback.find({ trainer: req.params.id })
    .populate("course")
    .populate("employee")
    .then(feedbacks => {
      feedbacks.forEach(feedback => {
        feedback.employee.fullname = feedback.employee.firstname + " " + feedback.employee.lastname;
      });
      return res.status(200).json(feedbacks);
    })
    .catch(err => {
      return res.status(500).json(err);
    });
});

router.get("/form/:id", (req, res) => {
  Feedback.findOne({ _id: req.params.id }).then(feedback => {
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    } else {
      return res.status(200).json(feedback);
    }
  });
});

router.post("/", (req, res) => {
  const newFeedback = new Feedback({
    course: req.body.course,
    employee: req.body.employee,
    trainer: req.body.trainer,
    content: req.body.content,
    addedOn: req.body.addedBy
  });
  newFeedback
    .save()
    .then(feedback => res.json(feedback))
    .catch(err => {
      res.json(err);
    });
});

router.post("/template", (req, res) => {
  const newFeedback = new Feedback({
    content: req.body.content
  });
  newFeedback
    .save()
    .then(feedback => res.json(feedback))
    .catch(err => {
      res.json(err);
    });
});

router.get("/template", (req, res) => {
  Feedback.findOne({ _id: "5ced34d359109121909e3684" }).then(feedback => {
    if (!feedback) {
      return res.status(404).json({ feedbackNotFound: "Feedback not found" });
    } else {
      return res.status(200).json(feedback);
    }
  });
});

router.put("/:id", (req, res) => {
  Feedback.findOne({ _id: req.params.id }).then(feedback => {
    feedback.name = req.body.name;
    feedback.category = req.body.category;
    feedback.modules = req.body.modules;
    feedback.report = req.body.report;
    feedback.addedBy = req.body.addedBy;
    feedback
      .save()
      .then(feedback => res.json(feedback))
      .catch(err => {
        res.json(err);
      });
  });
});

module.exports = router;
