'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Childcare = mongoose.model('Childcare'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  childcare;

/**
 * Childcare routes tests
 */
describe('Childcare CRUD tests', function () {

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

    // Save a user to the test db and create new Childcare
    user.save(function () {
      childcare = {
        name: 'Childcare name'
      };

      done();
    });
  });

  it('should be able to save a Childcare if logged in', function (done) {
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

        // Save a new Childcare
        agent.post('/api/childcares')
          .send(childcare)
          .expect(200)
          .end(function (childcareSaveErr, childcareSaveRes) {
            // Handle Childcare save error
            if (childcareSaveErr) {
              return done(childcareSaveErr);
            }

            // Get a list of Childcares
            agent.get('/api/childcares')
              .end(function (childcaresGetErr, childcaresGetRes) {
                // Handle Childcares save error
                if (childcaresGetErr) {
                  return done(childcaresGetErr);
                }

                // Get Childcares list
                var childcares = childcaresGetRes.body;

                // Set assertions
                (childcares[0].user._id).should.equal(userId);
                (childcares[0].name).should.match('Childcare name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Childcare if not logged in', function (done) {
    agent.post('/api/childcares')
      .send(childcare)
      .expect(403)
      .end(function (childcareSaveErr, childcareSaveRes) {
        // Call the assertion callback
        done(childcareSaveErr);
      });
  });

  it('should not be able to save an Childcare if no name is provided', function (done) {
    // Invalidate name field
    childcare.name = '';

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

        // Save a new Childcare
        agent.post('/api/childcares')
          .send(childcare)
          .expect(400)
          .end(function (childcareSaveErr, childcareSaveRes) {
            // Set message assertion
            (childcareSaveRes.body.message).should.match('Please fill Childcare name');

            // Handle Childcare save error
            done(childcareSaveErr);
          });
      });
  });

  it('should be able to update an Childcare if signed in', function (done) {
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

        // Save a new Childcare
        agent.post('/api/childcares')
          .send(childcare)
          .expect(200)
          .end(function (childcareSaveErr, childcareSaveRes) {
            // Handle Childcare save error
            if (childcareSaveErr) {
              return done(childcareSaveErr);
            }

            // Update Childcare name
            childcare.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Childcare
            agent.put('/api/childcares/' + childcareSaveRes.body._id)
              .send(childcare)
              .expect(200)
              .end(function (childcareUpdateErr, childcareUpdateRes) {
                // Handle Childcare update error
                if (childcareUpdateErr) {
                  return done(childcareUpdateErr);
                }

                // Set assertions
                (childcareUpdateRes.body._id).should.equal(childcareSaveRes.body._id);
                (childcareUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Childcares if not signed in', function (done) {
    // Create new Childcare model instance
    var childcareObj = new Childcare(childcare);

    // Save the childcare
    childcareObj.save(function () {
      // Request Childcares
      request(app).get('/api/childcares')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Childcare if not signed in', function (done) {
    // Create new Childcare model instance
    var childcareObj = new Childcare(childcare);

    // Save the Childcare
    childcareObj.save(function () {
      request(app).get('/api/childcares/' + childcareObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', childcare.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Childcare with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/childcares/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Childcare is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Childcare which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Childcare
    request(app).get('/api/childcares/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Childcare with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Childcare if signed in', function (done) {
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

        // Save a new Childcare
        agent.post('/api/childcares')
          .send(childcare)
          .expect(200)
          .end(function (childcareSaveErr, childcareSaveRes) {
            // Handle Childcare save error
            if (childcareSaveErr) {
              return done(childcareSaveErr);
            }

            // Delete an existing Childcare
            agent.delete('/api/childcares/' + childcareSaveRes.body._id)
              .send(childcare)
              .expect(200)
              .end(function (childcareDeleteErr, childcareDeleteRes) {
                // Handle childcare error error
                if (childcareDeleteErr) {
                  return done(childcareDeleteErr);
                }

                // Set assertions
                (childcareDeleteRes.body._id).should.equal(childcareSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Childcare if not signed in', function (done) {
    // Set Childcare user
    childcare.user = user;

    // Create new Childcare model instance
    var childcareObj = new Childcare(childcare);

    // Save the Childcare
    childcareObj.save(function () {
      // Try deleting Childcare
      request(app).delete('/api/childcares/' + childcareObj._id)
        .expect(403)
        .end(function (childcareDeleteErr, childcareDeleteRes) {
          // Set message assertion
          (childcareDeleteRes.body.message).should.match('User is not authorized');

          // Handle Childcare error error
          done(childcareDeleteErr);
        });

    });
  });

  it('should be able to get a single Childcare that has an orphaned user reference', function (done) {
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

          // Save a new Childcare
          agent.post('/api/childcares')
            .send(childcare)
            .expect(200)
            .end(function (childcareSaveErr, childcareSaveRes) {
              // Handle Childcare save error
              if (childcareSaveErr) {
                return done(childcareSaveErr);
              }

              // Set assertions on new Childcare
              (childcareSaveRes.body.name).should.equal(childcare.name);
              should.exist(childcareSaveRes.body.user);
              should.equal(childcareSaveRes.body.user._id, orphanId);

              // force the Childcare to have an orphaned user reference
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

                    // Get the Childcare
                    agent.get('/api/childcares/' + childcareSaveRes.body._id)
                      .expect(200)
                      .end(function (childcareInfoErr, childcareInfoRes) {
                        // Handle Childcare error
                        if (childcareInfoErr) {
                          return done(childcareInfoErr);
                        }

                        // Set assertions
                        (childcareInfoRes.body._id).should.equal(childcareSaveRes.body._id);
                        (childcareInfoRes.body.name).should.equal(childcare.name);
                        should.equal(childcareInfoRes.body.user, undefined);

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
      Childcare.remove().exec(done);
    });
  });
});
