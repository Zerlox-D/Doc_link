<?php
require 'config.php';
header('Content-Type: application/json');

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
