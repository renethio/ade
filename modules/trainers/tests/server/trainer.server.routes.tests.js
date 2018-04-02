'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Trainer = mongoose.model('Trainer'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  trainer;

/**
 * Trainer routes tests
 */
describe('Trainer CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Trainer
    user.save(function () {
      trainer = {
        name: 'Trainer name'
      };

      done();
    });
  });

  it('should be able to save a Trainer if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Trainer
        agent.post('/api/trainers')
          .send(trainer)
          .expect(200)
          .end(function (trainerSaveErr, trainerSaveRes) {
            // Handle Trainer save error
            if (trainerSaveErr) {
              return done(trainerSaveErr);
            }

            // Get a list of Trainers
            agent.get('/api/trainers')
              .end(function (trainersGetErr, trainersGetRes) {
                // Handle Trainers save error
                if (trainersGetErr) {
                  return done(trainersGetErr);
                }

                // Get Trainers list
                var trainers = trainersGetRes.body;

                // Set assertions
                (trainers[0].user._id).should.equal(userId);
                (trainers[0].name).should.match('Trainer name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Trainer if not logged in', function (done) {
    agent.post('/api/trainers')
      .send(trainer)
      .expect(403)
      .end(function (trainerSaveErr, trainerSaveRes) {
        // Call the assertion callback
        done(trainerSaveErr);
      });
  });

  it('should not be able to save an Trainer if no name is provided', function (done) {
    // Invalidate name field
    trainer.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Trainer
        agent.post('/api/trainers')
          .send(trainer)
          .expect(400)
          .end(function (trainerSaveErr, trainerSaveRes) {
            // Set message assertion
            (trainerSaveRes.body.message).should.match('Please fill Trainer name');

            // Handle Trainer save error
            done(trainerSaveErr);
          });
      });
  });

  it('should be able to update an Trainer if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Trainer
        agent.post('/api/trainers')
          .send(trainer)
          .expect(200)
          .end(function (trainerSaveErr, trainerSaveRes) {
            // Handle Trainer save error
            if (trainerSaveErr) {
              return done(trainerSaveErr);
            }

            // Update Trainer name
            trainer.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Trainer
            agent.put('/api/trainers/' + trainerSaveRes.body._id)
              .send(trainer)
              .expect(200)
              .end(function (trainerUpdateErr, trainerUpdateRes) {
                // Handle Trainer update error
                if (trainerUpdateErr) {
                  return done(trainerUpdateErr);
                }

                // Set assertions
                (trainerUpdateRes.body._id).should.equal(trainerSaveRes.body._id);
                (trainerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Trainers if not signed in', function (done) {
    // Create new Trainer model instance
    var trainerObj = new Trainer(trainer);

    // Save the trainer
    trainerObj.save(function () {
      // Request Trainers
      request(app).get('/api/trainers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Trainer if not signed in', function (done) {
    // Create new Trainer model instance
    var trainerObj = new Trainer(trainer);

    // Save the Trainer
    trainerObj.save(function () {
      request(app).get('/api/trainers/' + trainerObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', trainer.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Trainer with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/trainers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Trainer is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Trainer which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Trainer
    request(app).get('/api/trainers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Trainer with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Trainer if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Trainer
        agent.post('/api/trainers')
          .send(trainer)
          .expect(200)
          .end(function (trainerSaveErr, trainerSaveRes) {
            // Handle Trainer save error
            if (trainerSaveErr) {
              return done(trainerSaveErr);
            }

            // Delete an existing Trainer
            agent.delete('/api/trainers/' + trainerSaveRes.body._id)
              .send(trainer)
              .expect(200)
              .end(function (trainerDeleteErr, trainerDeleteRes) {
                // Handle trainer error error
                if (trainerDeleteErr) {
                  return done(trainerDeleteErr);
                }

                // Set assertions
                (trainerDeleteRes.body._id).should.equal(trainerSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Trainer if not signed in', function (done) {
    // Set Trainer user
    trainer.user = user;

    // Create new Trainer model instance
    var trainerObj = new Trainer(trainer);

    // Save the Trainer
    trainerObj.save(function () {
      // Try deleting Trainer
      request(app).delete('/api/trainers/' + trainerObj._id)
        .expect(403)
        .end(function (trainerDeleteErr, trainerDeleteRes) {
          // Set message assertion
          (trainerDeleteRes.body.message).should.match('User is not authorized');

          // Handle Trainer error error
          done(trainerDeleteErr);
        });

    });
  });

  it('should be able to get a single Trainer that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Trainer
          agent.post('/api/trainers')
            .send(trainer)
            .expect(200)
            .end(function (trainerSaveErr, trainerSaveRes) {
              // Handle Trainer save error
              if (trainerSaveErr) {
                return done(trainerSaveErr);
              }

              // Set assertions on new Trainer
              (trainerSaveRes.body.name).should.equal(trainer.name);
              should.exist(trainerSaveRes.body.user);
              should.equal(trainerSaveRes.body.user._id, orphanId);

              // force the Trainer to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Trainer
                    agent.get('/api/trainers/' + trainerSaveRes.body._id)
                      .expect(200)
                      .end(function (trainerInfoErr, trainerInfoRes) {
                        // Handle Trainer error
                        if (trainerInfoErr) {
                          return done(trainerInfoErr);
                        }

                        // Set assertions
                        (trainerInfoRes.body._id).should.equal(trainerSaveRes.body._id);
                        (trainerInfoRes.body.name).should.equal(trainer.name);
                        should.equal(trainerInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Trainer.remove().exec(done);
    });
  });
});
