<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require 'config.php';

$sql = "SELECT patient_id, first_name, last_name, email, phone_no, city, gender, created_at 
        FROM patients 
        ORDER BY patient_id DESC";

$result = $conn->query($sql);

$patients = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $patients[] = $row;
    }
}

echo json_encode([
    'success' => true,
    'patients' => $patients
]);

$conn->close();
?>
