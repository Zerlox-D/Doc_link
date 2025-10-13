<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require 'config.php';

if (!isset($_GET['patient_id'])) {
    echo json_encode(['success' => false, 'error' => 'Patient ID required']);
    exit;
}

$patient_id = intval($_GET['patient_id']);

$sql = "SELECT * FROM patients WHERE patient_id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'SQL prepare failed: ' . $conn->error]);
    exit;
}

$stmt->bind_param("i", $patient_id);
if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'error' => 'Query failed: ' . $stmt->error]);
    exit;
}

$result = $stmt->get_result();
$patient = $result->fetch_assoc();

if (!$patient) {
    echo json_encode(['success' => false, 'error' => 'Patient not found']);
    exit;
}

echo json_encode([
    'success' => true,
    'patient' => $patient
]);

$stmt->close();
$conn->close();
?>
