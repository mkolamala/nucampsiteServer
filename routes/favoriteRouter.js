const express = require("express");
const bodyParser = require("body-parser");
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const favoriteRouter = express.Router();
const cors = require("./cors");

module.exports = favoriteRouter;

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.findById(req.user._id)
      .populate("user")
      .populate("campsites")
      .then(favorites => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
      })
      .catch(err => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Favorite.findOne(req.user._id).then(favorite => {
      if (favorite) {
        req.body.forEach(function(item) {
          if (!favorite.campsites.includes(item._id)) {
            favorite.campsites.push(item._id);
          }
        });
      } else {
        Favorite.create({ user: req.user._id, campsites: req.body });
      }
      favorite
        .save()
        .then(favorite => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        })
        .catch(err => next(err));
    });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /campsites");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.deleteMany()
      .then(response => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch(err => next(err));
  });

favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.findById(req.params.campsiteId)
      .populate("user")
      .populate("campsites")
      .then(favorite => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorite);
      })
      .catch(err => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Favorite.findOne(req.user._id).then(favorite => {
      if (favorite) {
        if (favorite.campsites.includes(req.params.campsiteId)) {
          res.send(`That campsite is already in the list of favorites!`);
        } else {
          favorite.campsites.push(req.params.campsiteId);
        }
      } else {
        Favorite.create({
          user: req.user._id,
          campsites: req.params.campsiteId
        });
      }
      favorite
        .save()
        .then(favorite => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        })
        .catch(err => next(err));
    });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported ");
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Favorite.findByIdAndDelete(req.params.campsiteId)
        .then(response => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch(err => next(err));
    }
  );
