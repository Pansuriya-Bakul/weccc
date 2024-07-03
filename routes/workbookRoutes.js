const express = require('express');
const passport = require('passport');
const { validateBody, schemas } = require('../middleware/routeValidation');
const router = express.Router();

const WorkbookController = require('../controllers/workbookController');
const authenticate = passport.authenticate('JwtToken', { session: false });

router.get('/', authenticate, WorkbookController.readAll);
router.get('/:workbookId', authenticate, WorkbookController.readById);
// router.post('/', validateBody(schemas.workbook.create), authenticate, WorkbookController.create);
router.post('/', authenticate, WorkbookController.create);
router.patch('/:workbookId', authenticate, WorkbookController.update);
router.delete('/:workbookId', authenticate, WorkbookController.delete);
router.get('/user/:userId', WorkbookController.getUserWorkbooks); 
router.post('/assign-collections', WorkbookController.assignCollectionsToUsers);

module.exports = router;
