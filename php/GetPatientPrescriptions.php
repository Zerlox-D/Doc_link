<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require 'config.php';

if (!isset($_GET['patient_id'])) {
    echo json_encode(['success' => false, 'error' => 'Patient ID required']);
    exit;
}

$patient_id = intval($_GET['patient_id']);

$sql = "SELECT 
    p.prescription_id,
    p.appointment_id,
    p.diagnosis,
    p.prescription_date,
    p.notes,
    CONCAT(d.first_name, ' ', d.last_name) as doctor_name,
    d.specialty,
    d.hospital,
    a.appointment_date
FROM prescriptions p
JOIN doctors d ON p.doctor_id = d.doctor_id
JOIN appointments a ON p.appointment_id = a.appointment_id
WHERE p.patient_id = ?
ORDER BY p.prescription_date DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $patient_id);
$stmt->execute();
$result = $stmt->get_result();

$prescriptions = [];
while ($row = $result->fetch_assoc()) {
    $prescriptions[] = $row;
}

echo json_encode([
    'success' => true,
    'prescriptions' => $prescriptions
]);

$stmt->close();
$conn->close();
?>
