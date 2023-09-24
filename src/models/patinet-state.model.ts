import * as mongoose from 'mongoose';

//creating schema
const patientStateSchema =new mongoose.Schema({
  patientId: {
    type: mongoose.Types.ObjectId
  },
  doctortId: {
    type: mongoose.Types.ObjectId,
  },
    notes: String,
    message: String,
    tratmentSession:Date,
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
});

//creating model
const PatientState = mongoose.model('PatientState', patientStateSchema);

export default PatientState;
