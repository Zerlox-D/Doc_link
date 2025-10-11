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

if (!isset($data['patient_id'])) {
    echo json_encode(['success' => false, 'error' => 'Patient ID required']);
    exit;
}

$patient_id = intval($data['patient_id']);
$first_name = $conn->real_escape_string($data['first_name']);
$last_name = $conn->real_escape_string($data['last_name']);
$email = $conn->real_escape_string($data['email']);
$phone_no = $conn->real_escape_string($data['phone_no']);
$city = $conn->real_escape_string($data['city']);
$dob = $conn->real_escape_string($data['dob']);
$gender = $conn->real_escape_string($data['gender']);

$stmt = $conn->prepare("UPDATE patients SET first_name = ?, last_name = ?, email = ?, phone_no = ?, city = ?, dob = ?, gender = ? WHERE patient_id = ?");
$stmt->bind_param("sssssssi", $first_name, $last_name, $email, $phone_no, $city, $dob, $gender, $patient_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Database update failed']);
}

$stmt->close();
$conn->close();
