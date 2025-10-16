<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($data['appointment_id']) || !isset($data['patient_id']) || 
    !isset($data['doctor_id']) || !isset($data['diagnosis']) || 
    !isset($data['medicines']) || empty($data['medicines'])) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

$appointment_id = intval($data['appointment_id']);
$patient_id = intval($data['patient_id']);
$doctor_id = intval($data['doctor_id']);
$diagnosis = $conn->real_escape_string($data['diagnosis']);
$notes = isset($data['notes']) ? $conn->real_escape_string($data['notes']) : '';

// Start transaction
$conn->begin_transaction();

try {
    // Insert prescription
    $stmt = $conn->prepare("INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("iiiss", $appointment_id, $patient_id, $doctor_id, $diagnosis, $notes);
    
    if (!$stmt->execute()) {
        throw new Exception('Failed to insert prescription: ' . $stmt->error);
    }
    
    $prescription_id = $stmt->insert_id;
    $stmt->close();
    
    // Insert medicines
    $medicineStmt = $conn->prepare("INSERT INTO prescription_medicines (prescription_id, medicine_name, dosage, frequency, duration, instructions) VALUES (?, ?, ?, ?, ?, ?)");
    
    foreach ($data['medicines'] as $medicine) {
        if (empty($medicine['medicine_name']) || empty($medicine['dosage']) || 
            empty($medicine['frequency']) || empty($medicine['duration']) || 
            empty($medicine['instructions'])) {
            throw new Exception('Incomplete medicine information');
        }
        
        $med_name = $conn->real_escape_string($medicine['medicine_name']);
        $dosage = $conn->real_escape_string($medicine['dosage']);
        $frequency = $conn->real_escape_string($medicine['frequency']);
        $duration = $conn->real_escape_string($medicine['duration']);
        $instructions = $conn->real_escape_string($medicine['instructions']);
        
        $medicineStmt->bind_param("isssss", $prescription_id, $med_name, $dosage, $frequency, $duration, $instructions);
        
        if (!$medicineStmt->execute()) {
            throw new Exception('Failed to insert medicine: ' . $medicineStmt->error);
        }
    }
    
    $medicineStmt->close();
    
    // Commit transaction
    $conn->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Prescription saved successfully',
        'prescription_id' => $prescription_id
    ]);
    
} catch (Exception $e) {
    // Rollback on error
    $conn->rollback();
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?>
