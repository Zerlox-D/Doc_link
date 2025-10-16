import React, { useState, useEffect } from 'react';
import '../css/PrescriptionViewStyle.css';

export default function PrescriptionView({ prescription, onClose }) {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    fetchMedicines();
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await fetch(
        `http://localhost/Doc_Link/php/GetPrescriptionMedicines.php?prescription_id=${prescription.prescription_id}`
      );
      const data = await response.json();
      if (data.success) {
        setMedicines(data.medicines);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setLoading(false);
    }
  };

  return (
    <div className="prescription-view-overlay">
      <div className="prescription-view-modal">
        <div className="prescription-view-header">
          <h2>📋 Prescription Details</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="prescription-view-body">
          {/* Doctor Info */}
          <div className="info-section">
            <h3>Doctor Information</h3>
            <p><strong>Dr. {prescription.doctor_name}</strong></p>
            <p>{prescription.specialty}</p>
            <p>{prescription.hospital}</p>
          </div>

          {/* Prescription Info */}
          <div className="info-section">
            <h3>Prescription Details</h3>
            <p><strong>Date:</strong> {new Date(prescription.prescription_date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</p>
            <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
          </div>

          {/* Medicines */}
          <div className="info-section">
            <h3>℞ Prescribed Medicines</h3>
            {loading ? (
              <p>Loading medicines...</p>
            ) : (
              <div className="medicines-table">
                {medicines.map((med, index) => (
                  <div key={med.medicine_id} className="medicine-row">
                    <div className="medicine-number">{index + 1}</div>
                    <div className="medicine-details">
                      <h4>{med.medicine_name}</h4>
                      <div className="medicine-info">
                        <span><strong>Dosage:</strong> {med.dosage}</span>
                        <span><strong>Frequency:</strong> {med.frequency}</span>
                        <span><strong>Duration:</strong> {med.duration}</span>
                        <span><strong>Instructions:</strong> {med.instructions}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Notes */}
          {prescription.notes && (
            <div className="info-section">
              <h3>Additional Notes</h3>
              <p>{prescription.notes}</p>
            </div>
          )}

          {/* Download Button */}
          <div className="prescription-actions">
            <a 
              href={`http://localhost/Doc_Link/php/GeneratePrescriptionPDF.php?prescription_id=${prescription.prescription_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="download-btn"
            >
              📥 Download PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
