import React, { useState, useEffect } from 'react';
import '../css/PrescriptionStyle.css';

export default function PrescriptionForm({ appointment, onSuccess, onCancel, doctorId }) {
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medicines, setMedicines] = useState([
    {
      medicine_name: '',
      dosage: '',
      frequency: 'Twice daily',
      duration: '',
      instructions: 'After meals'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const frequencyOptions = [
    'Once daily',
    'Twice daily',
    'Thrice daily',
    'Four times daily',
    'Every 6 hours',
    'Every 8 hours',
    'As needed (SOS)',
    'Before bed',
    'Morning only',
    'Evening only'
  ];

  const instructionOptions = [
    'Before meals',
    'After meals',
    'With meals',
    'On empty stomach',
    'Before bed',
    'In the morning',
    'In the evening',
    'As needed',
    'With water',
    'With milk'
  ];

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        medicine_name: '',
        dosage: '',
        frequency: 'Twice daily',
        duration: '',
        instructions: 'After meals'
      }
    ]);
  };

  const removeMedicine = (index) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const updateMedicine = (index, field, value) => {
    const updatedMedicines = medicines.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    setMedicines(updatedMedicines);
  };

  const handleSubmit = async () => {
    // Validation
    if (!diagnosis.trim()) {
      alert('Please enter diagnosis/complaint');
      return;
    }

    const hasEmptyMedicine = medicines.some(
      m => !m.medicine_name.trim() || !m.dosage.trim() || !m.duration.trim()
    );

    if (hasEmptyMedicine) {
      alert('Please fill all required medicine fields');
      return;
    }

    setLoading(true);

    const prescriptionData = {
      appointment_id: appointment.appointment_id,
      patient_id: appointment.patient_id,
      doctor_id: doctorId,
      diagnosis: diagnosis,
      notes: notes,
      medicines: medicines
    };

    try {
      const response = await fetch('http://localhost/Doc_Link/php/SavePrescription.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescriptionData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Prescription saved successfully!');
        onSuccess();
      } else {
        alert('Error: ' + (data.error || 'Failed to save prescription'));
        setLoading(false);
      }
    } catch (error) {
      console.error('Error saving prescription:', error);
      alert('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="prescription-overlay">
      <div className="prescription-modal">
        <div className="prescription-header">
          <h2>Write Prescription</h2>
          <button onClick={onCancel} className="close-btn">×</button>
        </div>

        <div className="prescription-body">
          {/* Patient Info */}
          <div className="patient-info">
            <p><strong>Patient:</strong> {appointment.patient_name}</p>
            <p><strong>Date:</strong> {appointment.appointment_date}</p>
          </div>

          {/* Diagnosis */}
          <div className="form-group">
            <label>Diagnosis / Complaint: *</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g., Viral Fever, Body ache"
              required
            />
          </div>

          {/* Medicines */}
          <div className="medicines-section">
            <h3>Medicines</h3>
            {medicines.map((med, index) => (
              <div key={index} className="medicine-card">
                <div className="medicine-header">
                  <span>Medicine {index + 1}</span>
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicine(index)}
                      className="remove-btn"
                    >
                      🗑
                    </button>
                  )}
                </div>

                <div className="medicine-fields">
                  <div className="form-group">
                    <label>Medicine Name: *</label>
                    <input
                      type="text"
                      value={med.medicine_name}
                      onChange={(e) => updateMedicine(index, 'medicine_name', e.target.value)}
                      placeholder="e.g., Paracetamol"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Dosage: *</label>
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                      placeholder="e.g., 500mg - 1 tablet"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Frequency: *</label>
                    <select
                      value={med.frequency}
                      onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                    >
                      {frequencyOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Duration: *</label>
                    <input
                      type="text"
                      value={med.duration}
                      onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                      placeholder="e.g., 5 days, 1 week"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Instructions: *</label>
                    <select
                      value={med.instructions}
                      onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                    >
                      {instructionOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <button type="button" onClick={addMedicine} className="add-medicine-btn">
              + Add Another Medicine
            </button>
          </div>

          {/* Additional Notes */}
          <div className="form-group">
            <label>Additional Notes:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Rest recommended. Drink plenty of water."
              rows="3"
            />
          </div>

          {/* Action Buttons */}
          <div className="prescription-actions">
            <button onClick={onCancel} className="cancel-btn" disabled={loading}>
              Cancel
            </button>
            <button onClick={handleSubmit} className="save-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Prescription'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
