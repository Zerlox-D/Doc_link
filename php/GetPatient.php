<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require 'config.php';

$patient_id = isset($_GET['patient_id']) ? intval($_GET['patient_id']) : 0;

if ($patient_id <= 0) {
    echo json_encode(['error' => 'Invalid patient ID']);
    exit;
}

$stmt = $conn->prepare("SELECT patient_id, first_name, last_name, email, phone_no, city, dob, gender FROM patients WHERE patient_id = ?");
$stmt->bind_param("i", $patient_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(['error' => 'Patient not found']);
}

$stmt->close();
$conn->close();
