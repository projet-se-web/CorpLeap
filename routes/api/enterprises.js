const express = require('express');
const router = express.Router();
const Enterprise = require('../../models/Enterprise');

router.get('/', (req, res) => {
  Enterprise.find().then(enterprises => {
    if (enterprises.length === 0) {
      return res.status(404).json({ noEnterprise: 'No enterprise exists' });
    } else {
      return res.status(200).json(enterprises);
    }
  });
});

router.get('/:id', (req, res) => {
  Enterprise.findOne({ _id: req.params.id }).then(enterprise => {
    if (!enterprise) {
      return res.status(404).json({ enterpriseNotFound: 'Enterprise not found' });
    } else {
      return res.status(200).json(enterprise);
    }
  });
});

router.delete('/:id', (req, res) => {
  Enterprise.findOneAndDelete({ _id: req.params.id }, (err, response) => {
    if (err) {
      res.json(err);
    } else {
      res.status(200).json(response);
    }
  });
});

router.post('/', (req, res) => {
  const newEnterprise = new Enterprise({
    name: req.body.name,
    address: req.body.address,
    CUI: req.body.CUI,
    createdOn: req.body.createdOn,
    employees: req.body.employees
  });
  newEnterprise
    .save()
    .then(enterprise => res.json(enterprise))
    .catch(err => {
      res.json(err);
    });
});

router.put('/:id', (req, res) => {
  Enterprise.findOne({ _id: req.params.id }).then(enterprise => {
    enterprise.name = req.body.name;
    enterprise.address = req.body.address;
    enterprise.CUI = req.body.CUI;
    enterprise.createdOn = req.body.createdOn;
    enterprise.employees = req.body.employees;
    enterprise
      .save()
      .then(enterprise => res.json(enterprise))
      .catch(err => {
        res.json(err);
      });
    // Enterprise.findOneAndUpdate({_id: req.params.id}, newEnterprise, {new: true, upsert: true}, (err, response) => {
    //   if(err) {
    //     res.json(err);
    //   } else {
    //     res.status(200).json(response);
    //   }
  });
});

module.exports = router;