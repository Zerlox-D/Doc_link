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

if (!isset($data['doctor_id'])) {
    echo json_encode(['success' => false, 'error' => 'Doctor ID required']);
    exit;
}

$doctor_id = intval($data['doctor_id']);
$experience = intval($data['experience']);
$hospital = $conn->real_escape_string($data['hospital']);
$clinic = $conn->real_escape_string($data['clinic']);
$email = $conn->real_escape_string($data['email']);
$phone_no = $conn->real_escape_string($data['phone_no']);
$city = $conn->real_escape_string($data['city']);

$stmt = $conn->prepare("UPDATE doctors SET experience = ?, hospital = ?, clinic = ?, email = ?, phone_no = ?, city = ? WHERE doctor_id = ?");
$stmt->bind_param("isssssi", $experience, $hospital, $clinic, $email, $phone_no, $city, $doctor_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Database update failed']);
}

$stmt->close();
$conn->close();
