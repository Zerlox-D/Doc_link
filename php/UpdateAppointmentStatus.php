<?php
require 'config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['appointment_id']) || !isset($data['status'])) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

$appointment_id = intval($data['appointment_id']);
$status = $conn->real_escape_string($data['status']);

if (!in_array($status, ['confirmed', 'declined', 'cancelled'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid status']);
    exit;
}

$stmt = $conn->prepare("UPDATE appointments SET status = ? WHERE appointment_id = ?");
$stmt->bind_param("si", $status, $appointment_id);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Appointment status updated successfully'
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to update status']);
}

$stmt->close();
$conn->close();
?>
