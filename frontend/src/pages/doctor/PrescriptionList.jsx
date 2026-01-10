import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { FileText, ArrowRight, Eye, Download } from "lucide-react";

const PrescriptionList = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionData, setPrescriptionData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await api.get(
          `/doctor/fethParticularPrecription/${patientId}`
        );
        
        setPrescriptionData(res.data.data);
        setPrescriptions(res.data.data?.prescription || []);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load prescriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [patientId]);

  const handleViewPDF = (itemIndex) => {
    if (!prescriptionData || !prescriptionData._id) {
      toast.error("Prescription ID not found");
      return;
    }

    setPdfLoading(`view-${itemIndex}`);
    
    const baseURL = import.meta.env.VITE_BASE_URL;
    const url = `${baseURL}/prescriptions/${prescriptionData._id}/pdf/${itemIndex}?view=true`;
    
    console.log("Opening PDF URL:", url); 
    
    window.open(url, '_blank');
    
    setTimeout(() => setPdfLoading(null), 1000);
    toast.success("PDF opened in new tab");
  };

  const handleDownloadPDF = async (itemIndex) => {
    if (!prescriptionData || !prescriptionData._id) {
      toast.error("Prescription ID not found");
      return;
    }

    setPdfLoading(`download-${itemIndex}`);
    
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      const url = `${baseURL}/prescriptions/${prescriptionData._id}/pdf/${itemIndex}`;
      
      const response = await fetch(url, {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Download error response:", errorText);
        throw new Error(`Failed to generate PDF: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `prescription_visit_${itemIndex + 1}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Failed to download PDF: ${error.message}`);
    } finally {
      setPdfLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="h-72 flex items-center justify-center text-gray-400">
        Loading prescriptions…
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center text-gray-400">
        <p className="text-lg font-medium">No prescriptions found</p>
        <p className="text-sm mt-1">
          Complete a visit to generate prescription
        </p>
      </div>
    );
  }

  console.log("Prescription Document ID:", prescriptionData?._id);

  return (
    <div className="max-w-5xl mx-auto space-y-10 px-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Prescriptions
        </h1>
        <p className="text-gray-400 mt-2">
          Visit-wise optical prescriptions
        </p>
        {prescriptionData && (
          <p className="text-xs text-gray-500 mt-1">
            Prescription ID: {prescriptionData._id}
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {prescriptions.map((rx, index) => (
          <div
            key={rx._id || index}
            className="rounded-[26px] bg-white/[0.04] border border-white/10
            backdrop-blur-xl p-6 hover:bg-white/[0.07] transition"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20
              flex items-center justify-center ring-1 ring-emerald-500/30">
                <FileText className="text-emerald-400" />
              </div>

              <div>
                <p className="font-semibold">
                  Visit #{index + 1}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(rx.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* pdf button area */}
            <div className="space-y-2 mb-3">
              <button
                onClick={() => handleViewPDF(index)}
                disabled={pdfLoading === `view-${index}`}
                className="w-full inline-flex items-center justify-center
                gap-2 px-4 py-2.5 rounded-xl bg-blue-600/20
                text-blue-400 hover:bg-blue-600/30 transition text-sm
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pdfLoading === `view-${index}` ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    Opening...
                  </>
                ) : (
                  <>
                    <Eye size={16} />
                    View PDF
                  </>
                )}
              </button>

              <button
                onClick={() => handleDownloadPDF(index)}
                disabled={pdfLoading === `download-${index}`}
                className="w-full inline-flex items-center justify-center
                gap-2 px-4 py-2.5 rounded-xl bg-purple-600/20
                text-purple-400 hover:bg-purple-600/30 transition text-sm
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pdfLoading === `download-${index}` ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    Download PDF
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() =>
                navigate(
                  `/doctor/prescription/${patientId}/${rx.subStep}`
                )
              }
              className="w-full inline-flex items-center justify-center
              gap-2 px-5 py-3 rounded-xl bg-emerald-600/20
              text-emerald-400 hover:bg-emerald-600/30 transition text-sm"
            >
              Open Prescription
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionList;