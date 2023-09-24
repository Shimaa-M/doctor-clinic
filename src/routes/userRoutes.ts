import express from 'express';
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/find-all-patients', authController.restrictTo(['DOCTOR']), userController.findAllPatients);
router.patch('/update-patient-state/:patientId',authController.restrictTo(['DOCTOR']), userController.updatePatientState);
 router.post('/create-patient-state',authController.restrictTo(['DOCTOR']), userController.createPatientState);

// router
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

  module.exports = router;