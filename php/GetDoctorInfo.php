<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require 'config.php';

if (!isset($_GET['doctor_id'])) {
    echo json_encode(['success' => false, 'error' => 'Doctor ID required']);
    exit;
}

$doctor_id = intval($_GET['doctor_id']);

// Get doctor details
$stmt = $conn->prepare("SELECT doctor_id, clinic, hospital FROM doctors WHERE doctor_id = ? AND verified = 1");
$stmt->bind_param("i", $doctor_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'error' => 'Doctor not found']);
    exit;
}

$doctor = $result->fetch_assoc();

// Get availability with home visit info
$stmt2 = $conn->prepare("SELECT day_of_week, home_visit_available FROM fees_and_availability WHERE doctor_id = ?");
$stmt2->bind_param("i", $doctor_id);
$stmt2->execute();
$result2 = $stmt2->get_result();

$availability = [];
while ($row = $result2->fetch_assoc()) {
    $availability[] = $row;
}

// ✅ CHECK WHAT LOCATIONS ARE AVAILABLE
$available_locations = [];

// Only add Hospital if it's not NULL/empty
if (!empty($doctor['hospital']) && trim($doctor['hospital']) !== '' && strtoupper(trim($doctor['hospital'])) !== 'NULL') {
    $available_locations[] = 'Hospital';
}

// Only add Clinic if it's not NULL/empty
if (!empty($doctor['clinic']) && trim($doctor['clinic']) !== '' && strtoupper(trim($doctor['clinic'])) !== 'NULL') {
    $available_locations[] = 'Clinic';
}

echo json_encode([
    'success' => true,
    'doctor' => $doctor,
    'availability' => $availability,
    'available_locations' => $available_locations 
]);

$stmt->close();
$stmt2->close();
$conn->close();
?>
