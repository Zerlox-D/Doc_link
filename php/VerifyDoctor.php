<?php
require 'config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['doctor_id']) || !isset($data['action'])) {
    echo json_encode(['success' => false, 'error' => 'Missing required parameters']);
    exit;
}

$doctor_id = intval($data['doctor_id']);
$action = $data['action'];

if ($action === 'approve') {
    // Set verified = 1
    $stmt = $conn->prepare("UPDATE doctors SET verified = 1 WHERE doctor_id = ?");
    $stmt->bind_param("i", $doctor_id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Doctor verified successfully']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to verify doctor']);
    }
    $stmt->close();
    
} else if ($action === 'reject') {
    // Delete the doctor account
    $stmt = $conn->prepare("DELETE FROM doctors WHERE doctor_id = ?");
    $stmt->bind_param("i", $doctor_id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Doctor rejected and removed']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to reject doctor']);
    }
    $stmt->close();
}

$conn->close();
?>
