import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import AdminLogin from "./auth/AdminLogin";
import DoctorLogin from "./auth/DoctorLogin";
import ProtectedRoute from "./auth/ProtectedRoute";

// doctor
import DoctorLayout from "./layouts/DoctorLayout";
import DoctorDashboard from "./pages/doctor/Dashboard";
import PatientList from "./pages/doctor/PatientList";
import AddPatient from "./pages/doctor/AddPatient";
import Checkup from "./pages/doctor/Checkup";
import PatientVisits from "./pages/doctor/PatientVisits";
import VisitDetails from "./pages/doctor/VisitDetails";
import Prescription from "./pages/doctor/Prescription";
import PrescriptionList from "./pages/doctor/PrescriptionList";

// admin
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorManagement from "./pages/admin/DoctorManagement";
import Login from "../src/pages/Login.jsx"

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />}/> 
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="doctors" element={<DoctorManagement />} />
          </Route>

          <Route
            path="/doctor"
            element={
              <ProtectedRoute role="doctor">
                <DoctorLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="patients" element={<PatientList />} />
            <Route path="add-patient" element={<AddPatient />} />
            <Route path="checkup/:patientId" element={<Checkup />} />
            <Route path="patient/:id/visits" element={<PatientVisits />} />
            <Route path="visit/:visitId" element={<VisitDetails />} />

            <Route
              path="prescriptions/:patientId"
              element={<PrescriptionList />}
            />

            <Route
              path="prescription/:patientId/:visitId"
              element={<Prescription />}
            />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
