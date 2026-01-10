import { Router } from 'express';
import {
  generateSinglePrescriptionPDF,
  generateAllPrescriptionItemsPDF,
  generateAllPatientPrescriptionsPDF,
  previewPrescription
} from '../controllers/prescriptionPDF.controllers.js';

const router = Router();

// itemIndex is optional - defaults to 0 (first prescription)
router.get('/:prescriptionId/pdf/:itemIndex', generateSinglePrescriptionPDF);
// router.get('/:prescriptionId/pdf/:itemIndex?', generateSinglePrescriptionPDF);

// Generate all prescription items as separate PDFs (ZIP if multiple)
// GET /api/v1/prescriptions/:prescriptionId/pdf-all
router.get('/:prescriptionId/pdf-all', generateAllPrescriptionItemsPDF);

// Generate all prescriptions for a patient
// GET /api/v1/prescriptions/patient/:patientId/pdfs
router.get('/patient/:patientId/pdfs', generateAllPatientPrescriptionsPDF);

// Preview prescription HTML (for testing)
// GET /api/v1/prescriptions/:prescriptionId/preview/:itemIndex?
// router.get('/:prescriptionId/preview/:itemIndex?', previewPrescription);
router.get('/:prescriptionId/preview/:itemIndex', previewPrescription);

export default router;