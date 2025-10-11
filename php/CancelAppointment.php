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

if (!isset($data['appointment_id'])) {
    echo json_encode(['success' => false, 'error' => 'Appointment ID required']);
    exit;
}

$appointment_id = intval($data['appointment_id']);

$stmt = $conn->prepare("DELETE FROM appointments WHERE appointment_id = ?");
$stmt->bind_param("i", $appointment_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to cancel appointment']);
}

$stmt->close();
$conn->close();
