/*
=============================================================
This route will validate that the correct token is being used
and then pull its specific data from the UserController.
=============================================================
*/

const passport = require('passport');
const express = require('express');
const { validateBody, schemas } = require('../middleware/routeValidation');
const router = express.Router();

require('../config/passport');

const UsersController = require('../controllers/userController');
const authenticate = passport.authenticate('JwtToken', { session: false });

router.get('/install', UsersController.install);
router.post('/checkdups', UsersController.checkDups);
router.get('/validate', authenticate, UsersController.check);
router.post('/register', validateBody(schemas.auth.register), authenticate, UsersController.signup);
router.post('/selfRegister', validateBody(schemas.auth.selfRegister), UsersController.selfRegister);
router.post(
	'/login',
	validateBody(schemas.auth.login),
	passport.authenticate('Local', { session: false }),
	// () => {console.log("CANT GET HERE")},
	UsersController.login
);
router.post('/wecc', UsersController.WECClogin);
router.get('/:userID', authenticate, UsersController.read);
router.get('/1/:userID', authenticate, UsersController.fullread);
router.get('/', authenticate, UsersController.readall);
router.post('/query', authenticate, UsersController.query);
router.patch('/:userID', authenticate, UsersController.update);
router.delete('/:userID', authenticate, UsersController.delete);
router.get('/client/:userID', authenticate, UsersController.findClientSurveys); // find client surveys
router.get('/research/create/:userID', authenticate, UsersController.createResearchID);
router.get('/getAllUsers/:userID', authenticate, UsersController.getAllUsers);

module.exports = router;
