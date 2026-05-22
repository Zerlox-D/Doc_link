<?php
require 'config.php';
header('Content-Type: application/json');

$sql = "SELECT doctor_id, first_name, last_name, email, phone_no, license_no, specialty, experience, hospital, clinic, city, gender, dob 
        FROM doctors 
        WHERE verified = 0 
        ORDER BY doctor_id DESC";

$result = $conn->query($sql);

$doctors = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $doctors[] = $row;
    }
}

echo json_encode([
    'success' => true,
    'doctors' => $doctors
]);

$conn->close();
?>