import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

function controllerRouting(app) {
  const router = express.Router();
  app.use('/', router);

  // App Controller

  // return if Redis and DB  is alive
  router.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });

  // return number of users and files in db
  router.get('/stats', (req, res) => {
    AppController.getStats(req, res);
  });

  // User Controller

  // create a new user in DB
  router.post('/users', (req, res) => {
    UsersController.postNew(req, res);
  });

  // get the user base on the token used
  router.get('/users/me', (req, res) => {
    UsersController.getMe(req, res);
  });

  // Auth Controller

  // sign-in the user by generating a new auth token
  router.get('/connect', (req, res) => {
    AuthController.getConnect(req, res);
  });

  // sign-out user based on the token
  router.get('/disconnect', (req, res) => {
    AuthController.getDisconnect(req, res);
  });

  // Files Controller

  // create a new file in DB and in disk
  router.post('/files', (req, res) => {
    FilesController.postUpload(req, res);
  });

  // get the file document based on the ID
  router.get('/files/:id', (req, res) => {
    FilesController.getShow(req, res);
  });

  // get all users file documents
  router.get('/files', (req, res) => {
    FilesController.getIndex(req, res);
  });

  // set isPublic to true on the file document based on ID
  router.put('/files/:id/publish', (req, res) => {
    FilesController.putPublish(req, res);
  });

  // set isPublic to false on the file document based on id
  router.put('/files/:id/unpublish', (req, res) => {
    FilesController.putUnpublish(req, res);
  });

  // return content of the file document based on the id
  router.get('/files/:id/data', (req, res) => {
    FilesController.getFile(req, res);
  });
}

export default controllerRouting;
