const express = require('express');
const router = express.Router();
const Course = require('../../models/Course');

router.get('/', (req, res) => {
  Course.find().then(courses => {
    if (courses.length === 0) {
      return res.status(404).json({ noCourse: 'No course exists' });
    } else {
      return res.status(200).json(courses);
    }
  });
});

router.get('/:id', (req, res) => {
  Course.findOne({ _id: req.params.id }).then(course => {
    if (!course) {
      return res.status(404).json({ courseNotFound: 'Course not found' });
    } else {
      return res.status(200).json(course);
    }
  });
});

router.delete('/:id', (req, res) => {
  Course.findOneAndDelete({ _id: req.params.id }, (err, response) => {
    if (err) {
      res.json(err);
    } else {
      res.status(200).json(response);
    }
  });
});

router.post('/', (req, res) => {
  const newCourse = new Course({
    name: req.body.name,
    category: req.body.category,
    modules: req.body.modules,
    report: req.body.report,
    addedBy: req.body.addedBy
  });
  newCourse
    .save()
    .then(course => res.json(course))
    .catch(err => {
      res.json(err);
    });
});

router.put('/:id', (req, res) => {
  Course.findOne({ _id: req.params.id }).then(course => {
    course.name = req.body.name;
    course.category = req.body.category;
    course.modules = req.body.modules;
    course.report = req.body.report;
    course.addedBy = req.body.addedBy;
    course
      .save()
      .then(course => res.json(course))
      .catch(err => {
        res.json(err);
      });
  });
});

module.exports = router;