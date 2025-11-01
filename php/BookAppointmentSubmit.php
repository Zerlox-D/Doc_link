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
$patient_name = $conn->real_escape_string(trim($data['patient_name']));
$booking_reason = isset($data['booking_reason']) ? $conn->real_escape_string($data['booking_reason']) : null;
$appointment_date = $conn->real_escape_string($data['appointment_date']);
$appointment_time = $conn->real_escape_string($data['appointment_time']);
$mode_of_booking = $conn->real_escape_string($data['mode_of_booking']);

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
