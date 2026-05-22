<?php
require 'config.php';
header('Content-Type: application/json');

$doctor_id = isset($_GET['doctor_id']) ? intval($_GET['doctor_id']) : 0;

if ($doctor_id <= 0) {
    echo json_encode(['error' => 'Invalid doctor ID']);
    exit;
}

$stmt = $conn->prepare("SELECT verified FROM doctors WHERE doctor_id = ?");
$stmt->bind_param("i", $doctor_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode(['verified' => (bool)$row['verified']]);
} else {
    echo json_encode(['error' => 'Doctor not found']);
}

$stmt->close();
$conn->close();
