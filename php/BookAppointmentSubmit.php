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
if (!isset($data['patient_id']) || !isset($data['doctor_id']) || 
    !isset($data['appointment_date']) || !isset($data['appointment_time']) || 
    !isset($data['mode_of_booking'])) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

$patient_id = intval($data['patient_id']);
$doctor_id = intval($data['doctor_id']);
$booking_reason = $data['booking_reason'] ?? null;
$appointment_date = $data['appointment_date'];
$appointment_time = $data['appointment_time'];
$mode_of_booking = $conn->real_escape_string($data['mode_of_booking']);

// ✅ FIX: Get patient name from patient_id
$patientQuery = $conn->prepare("SELECT CONCAT(first_name, ' ', last_name) as full_name FROM patients WHERE patient_id = ?");
$patientQuery->bind_param("i", $patient_id);
$patientQuery->execute();
$patientResult = $patientQuery->get_result();

if ($patientResult->num_rows === 0) {
    echo json_encode(['success' => false, 'error' => 'Patient not found']);
    exit;
}

$patientData = $patientResult->fetch_assoc();
$patient_name = $patientData['full_name'];
$patientQuery->close();

// Insert appointment
$stmt = $conn->prepare("INSERT INTO appointments (patient_id, doctor_id, patient_name, booking_reason, appointment_date, appointment_time, mode_of_booking, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')");

$stmt->bind_param("iisssss", $patient_id, $doctor_id, $patient_name, $booking_reason, $appointment_date, $appointment_time, $mode_of_booking);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Appointment booked successfully',
        'appointment_id' => $stmt->insert_id
    ]);
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Failed to book appointment: ' . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
