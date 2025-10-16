<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require 'config.php';

if (!isset($_GET['prescription_id'])) {
    echo json_encode(['success' => false, 'error' => 'Prescription ID required']);
    exit;
}

$prescription_id = intval($_GET['prescription_id']);

$sql = "SELECT 
    medicine_id,
    medicine_name,
    dosage,
    frequency,
    duration,
    instructions
FROM prescription_medicines
WHERE prescription_id = ?
ORDER BY medicine_id ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $prescription_id);
$stmt->execute();
$result = $stmt->get_result();

$medicines = [];
while ($row = $result->fetch_assoc()) {
    $medicines[] = $row;
}

echo json_encode([
    'success' => true,
    'medicines' => $medicines
]);

$stmt->close();
$conn->close();
?>
