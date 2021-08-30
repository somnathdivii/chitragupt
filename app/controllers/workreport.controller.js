const db = require("../models");
const Workreport = db.workreport;

// Create and Save a new Workreport
exports.create = (req, res) => {
  // Validate request
  if (!req.body.xpname) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Workreport
  const workreport = new Workreport({
    xpname: req.body.xpname,
    workreport: req.body.workreport,
    timespent : req.body.timespent,
    user_id : req.session.userId,
    published: req.body.published ? req.body.published : false
  });

  // Save workreport in the database
  workreport
    .save(workreport)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the workreport."
      });
    });
};

// Retrieve all workreport from the database.
exports.findAll = (req, res) => {
  const xpname = req.query.xpname;
  var condition = xpname ? { xpname: { $regex: new RegExp(xpname), $options: "i" } } : {};

  Workreport.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving workreports."
      });
    });
};

// Find a single Workreport with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Workreport.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found workreport with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving workreport with id=" + id });
    });
};

// Update a workreport by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Workreport.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update workreport with id=${id}. Maybe workreport was not found!`
        });
      } else res.send({ message: "workreport was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating workreport with id=" + id
      });
    });
};

// Delete a workreport with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Workreport.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Workreport with id=${id}. Maybe Workreport was not found!`
        });
      } else {
        res.send({
          message: "Workreport was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Workreport with id=" + id
      });
    });
};

// Delete all Workreport from the database.
// exports.deleteAll = (req, res) => {
//   Workreport.deleteMany({})
//     .then(data => {
//       res.send({
//         message: `${data.deletedCount} workreport were deleted successfully!`
//       });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while removing all workreport."
//       });
//     });
// };

// Find all published workreport
exports.findAllPublished = (req, res) => {
  Workreport.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving workreports."
      });
    });
};
