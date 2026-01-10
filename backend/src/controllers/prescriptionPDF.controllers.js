import puppeteer from 'puppeteer';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Prescription } from '../models/rXverification.models.js';
import { Patient } from '../models/patient.models.js';


const formatValue = (value) => {
  return value === 0 || value === null || value === undefined ? '--' : value;
};


const generatePrescriptionHTML = (prescriptionItem, patientData, index) => {
  // get the first item from arrays (based on your model structure)
  const bifocal = prescriptionItem.bifocal?.[0] || null;
  const nearVision = prescriptionItem.nearVisionPower?.[0] || null;
  const farVision = prescriptionItem.farVisionPower?.[0] || null;

  const today = new Date();
  const eyeTestDate = prescriptionItem.createdAt || today;
  
  // atto calcualte next visit date after 6 months onwards !! can be changed according to requirements
  const nextTestDate = new Date(eyeTestDate);
  nextTestDate.setMonth(nextTestDate.getMonth() + 6);
  const logo = "https://res.cloudinary.com/dkrwq4wvi/image/upload/v1766512758/eyeLogo.jpg"
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Eye Test Prescription</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 40px;
          background: white;
        }
        
        .prescription-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
        }
        
        .page-indicator {
          position: absolute;
          top: 20px;
          left: 40px;
          font-size: 14px;
          color: #999;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .logo-placeholder {
          width: 100px;
          height: 100px;
          background: #1a237e;
          border-radius: 50%;
          margin: 0 auto 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 36px;
          font-weight: bold;
        }
        
        .brand-name {
          font-size: 28px;
          font-weight: 600;
          color: #1a237e;
          margin-bottom: 10px;
        }
        
        h1 {
          font-size: 32px;
          font-weight: 700;
          color: #000;
          margin-top: 20px;
        }
        
        .patient-info {
          display: flex;
          justify-content: space-between;
          margin: 30px 0;
          padding: 20px 0;
          border-bottom: 2px solid #e0e0e0;
        }
        
        .info-group {
          flex: 1;
        }
        
        .info-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }
        
        .info-value {
          font-size: 18px;
          font-weight: 600;
          color: #000;
        }
        
        .store-info {
          margin: 20px 0;
        }
        
        .section {
          margin: 40px 0;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #000;
          margin-bottom: 15px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          background: #f5f5f5;
          border-radius: 8px;
          overflow: hidden;
        }
        
        th {
          background: #e0e0e0;
          padding: 12px;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          color: #333;
          border: 1px solid #d0d0d0;
        }
        
        td {
          padding: 12px;
          text-align: center;
          font-size: 14px;
          color: #000;
          border: 1px solid #d0d0d0;
          background: white;
        }
        
        td:first-child {
          background: #e0e0e0;
          font-weight: 600;
        }
        
        .next-test {
          margin-top: 60px;
          text-align: center;
          padding: 30px;
          background: #f5f5f5;
          border-radius: 8px;
        }
        
        .next-test-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }
        
        .next-test-date {
          font-size: 36px;
          font-weight: 700;
          color: #000;
          margin-bottom: 5px;
        }
        
        .next-test-day {
          font-size: 16px;
          color: #666;
        }
        
        .footer-note {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          font-size: 12px;
          color: #999;
          text-align: center;
        }
        
        .ownerName {
          font-size: 28px;
          font-weight: 600;
          color: #1a237e;
        }
      </style>
    </head>
    <body>
      <div class="prescription-container">
        ${index !== null ? `<div class="page-indicator">${index}</div>` : ''}
        
        <div class="header">
          <img
  class=logo-placeholder
  src=${logo} />
          <div class="brand-name">ABC EYE HOSPITAL</div>
          <p class="ownerName">By ABC YOU</p>
          <h1>Eye Test Prescription</h1>
        </div>
        
        <div class="patient-info">
          <div class="info-group">
            <div class="info-label">Customer Name</div>
            <div class="info-value">${patientData.fullName || 'N/A'}</div>
          </div>
          <div class="info-group">
            <div class="info-label">Eye Test Date</div>
            <div class="info-value">${new Date(eyeTestDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}</div>
          </div>
        </div>
        
        <div class="store-info">
          <div class="info-label">Store Address</div>
          <div class="info-value" style="font-size: 14px; font-weight: 400; color: #333;">
            abchospital.in, your location
          </div>
        </div>
        
        ${bifocal ? `
        <div class="section">
          <div class="section-title">Bifocal/Progressive Power</div>
          <table>
            <thead>
              <tr>
                <th>Rx</th>
                <th>Spherical</th>
                <th>Cylindrical</th>
                <th>Axis</th>
                <th>Pupil Distance</th>
                <th>Add. Power</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Right Eye</td>
                <td>${formatValue(bifocal.rightEye?.spherical)}</td>
                <td>${formatValue(bifocal.rightEye?.cylindrical)}</td>
                <td>${formatValue(bifocal.rightEye?.axis)}</td>
                <td>${formatValue(bifocal.rightEye?.pupilDistance)}</td>
                <td>${formatValue(bifocal.rightEye?.addPower)}</td>
              </tr>
              <tr>
                <td>Left Eye</td>
                <td>${formatValue(bifocal.leftEye?.spherical)}</td>
                <td>${formatValue(bifocal.leftEye?.cylindrical)}</td>
                <td>${formatValue(bifocal.leftEye?.axis)}</td>
                <td>${formatValue(bifocal.leftEye?.pupilDistance)}</td>
                <td>${formatValue(bifocal.leftEye?.addPower)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        ` : ''}
        
        ${nearVision ? `
        <div class="section">
          <div class="section-title">Near Vision Power</div>
          <table>
            <thead>
              <tr>
                <th>Rx</th>
                <th>Spherical</th>
                <th>Cylindrical</th>
                <th>Axis</th>
                <th>Pupil Distance</th>
                <th>Add. Power</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Right Eye</td>
                <td>${formatValue(nearVision.rightEye?.spherical)}</td>
                <td>${formatValue(nearVision.rightEye?.cylindrical)}</td>
                <td>${formatValue(nearVision.rightEye?.axis)}</td>
                <td>${formatValue(nearVision.rightEye?.pupilDistance)}</td>
                <td>${formatValue(nearVision.rightEye?.addPower)}</td>
              </tr>
              <tr>
                <td>Left Eye</td>
                <td>${formatValue(nearVision.leftEye?.spherical)}</td>
                <td>${formatValue(nearVision.leftEye?.cylindrical)}</td>
                <td>${formatValue(nearVision.leftEye?.axis)}</td>
                <td>${formatValue(nearVision.leftEye?.pupilDistance)}</td>
                <td>${formatValue(nearVision.leftEye?.addPower)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        ` : ''}
        
        ${farVision ? `
        <div class="section">
          <div class="section-title">Far Vision Power</div>
          <table>
            <thead>
              <tr>
                <th>Rx</th>
                <th>Spherical</th>
                <th>Cylindrical</th>
                <th>Axis</th>
                <th>Pupil Distance</th>
                <th>Add. Power</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Right Eye</td>
                <td>${formatValue(farVision.rightEye?.spherical)}</td>
                <td>${formatValue(farVision.rightEye?.cylindrical)}</td>
                <td>${formatValue(farVision.rightEye?.axis)}</td>
                <td>${formatValue(farVision.rightEye?.pupilDistance)}</td>
                <td>${formatValue(farVision.rightEye?.addPower)}</td>
              </tr>
              <tr>
                <td>Left Eye</td>
                <td>${formatValue(farVision.leftEye?.spherical)}</td>
                <td>${formatValue(farVision.leftEye?.cylindrical)}</td>
                <td>${formatValue(farVision.leftEye?.axis)}</td>
                <td>${formatValue(farVision.leftEye?.pupilDistance)}</td>
                <td>${formatValue(farVision.leftEye?.addPower)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        ` : ''}
        
        <div class="next-test">
          <div class="next-test-label">Your next eye test date</div>
          <div class="next-test-date">${nextTestDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })}</div>
          <div class="next-test-day">${nextTestDate.toLocaleDateString('en-US', { 
            weekday: 'long'
          })} • ${nextTestDate.getFullYear()}</div>
        </div>
        
        <div class="footer-note">
          Note: This is a system-generated prescription.
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateSinglePrescriptionPDF = asyncHandler(async (req, res) => {
  const { prescriptionId, itemIndex } = req.params;
  const { view } = req.query; // check for ?view=true

  // fetching patient data , by populating itself
  const prescription = await Prescription.findById(prescriptionId)
    .populate('patient');
  
  if (!prescription) {
    throw new ApiError(404, 'Prescription not found');
  }

  if (!prescription.patient) {
    throw new ApiError(404, 'Patient not found');
  }

  // gget specific prescription item or first one
  const index = itemIndex ? parseInt(itemIndex) : 0;
  const prescriptionItem = prescription.prescription[index];

  if (!prescriptionItem) {
    throw new ApiError(404, 'Prescription item not found at that index');
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // generation of html doc
    const html = generatePrescriptionHTML(
      prescriptionItem, 
      prescription.patient,
      `Visit ${index + 1}`
    );
    
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // generation of final pdf
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    
    // if ?view=true, show inline (browser), otherwise download
    const disposition = view === 'true' ? 'inline' : 'attachment';
    res.setHeader(
      'Content-Disposition',
      `${disposition}; filename=prescription_${prescription.patient.fullName}_visit_${index + 1}.pdf`
    );

    res.send(pdfBuffer);

  } catch (error) {
    await browser.close();
    throw new ApiError(500, `PDF generation failed: ${error.message}`);
  }
});

// ggeneration all prescription items for a prescription as separate PDFs (ZIP) !
export const generateAllPrescriptionItemsPDF = asyncHandler(async (req, res) => {
  const { prescriptionId } = req.params;

  const prescription = await Prescription.findById(prescriptionId)
    .populate('patient');
  
  if (!prescription) {
    throw new ApiError(404, 'Prescription not found');
  }

  if (!prescription.patient) {
    throw new ApiError(404, 'Patient not found');
  }

  const prescriptionItems = prescription.prescription;

  if (!prescriptionItems || prescriptionItems.length === 0) {
    throw new ApiError(404, 'No prescription items found');
  }

  // if only one item, return single PDF
  if (prescriptionItems.length === 1) {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const html = generatePrescriptionHTML(prescriptionItems[0], prescription.patient, 'Visit 1');
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=prescription_${prescription.patient.fullName}.pdf`
    );

    return res.send(pdfBuffer);
  }

  // multiple items - create ZIP --> have to extract later
  const archiver = require('archiver');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const pdfBuffers = [];

    for (let i = 0; i < prescriptionItems.length; i++) {
      const page = await browser.newPage();
      const html = generatePrescriptionHTML(
        prescriptionItems[i], 
        prescription.patient,
        `Visit ${i + 1}`
      );
      
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
      });

      pdfBuffers.push({
        buffer: pdfBuffer,
        filename: `prescription_visit_${i + 1}.pdf`
      });

      await page.close();
    }

    await browser.close();

    // create ZIP
    const archive = archiver('zip', { zlib: { level: 9 } });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=prescriptions_${prescription.patient.fullName}_${Date.now()}.zip`
    );

    archive.pipe(res);

    pdfBuffers.forEach(({ buffer, filename }) => {
      archive.append(buffer, { name: filename });
    });

    await archive.finalize();

  } catch (error) {
    await browser.close();
    throw new ApiError(500, `PDF generation failed: ${error.message}`);
  }
});

// gwet all prescriptions for a patient
export const generateAllPatientPrescriptionsPDF = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  const patient = await Patient.findById(patientId);
  
  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  // fetch prescription for this patient
  const prescription = await Prescription.findOne({ patient: patientId });

  if (!prescription || !prescription.prescription || prescription.prescription.length === 0) {
    throw new ApiError(404, 'No prescriptions found for this patient');
  }

  // redirect to the all prescription items endpoint
  req.params.prescriptionId = prescription._id;
  return generateAllPrescriptionItemsPDF(req, res);
});

// preview prescription HTML
export const previewPrescription = asyncHandler(async (req, res) => {
  const { prescriptionId, itemIndex } = req.params;

  const prescription = await Prescription.findById(prescriptionId)
    .populate('patient');
  
  if (!prescription) {
    throw new ApiError(404, 'Prescription not found');
  }

  const index = itemIndex ? parseInt(itemIndex) : 0;
  const prescriptionItem = prescription.prescription[index];

  if (!prescriptionItem) {
    throw new ApiError(404, 'Prescription item not found');
  }

  const html = generatePrescriptionHTML(prescriptionItem, prescription.patient, `Visit ${index + 1}`);

  return res.status(200).json(
    new ApiResponse(200, { html }, 'Prescription HTML generated')
  );
});