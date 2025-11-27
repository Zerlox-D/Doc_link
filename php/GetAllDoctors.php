<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require 'config.php';

$sql = "SELECT doctor_id, first_name, last_name, email, phone_no, specialty, experience, hospital, clinic, city, verified 
        FROM doctors 
        ORDER BY verified ASC, doctor_id DESC";

$result = $conn->query($sql);

$doctors = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $doctors[] = [
            'doctor_id' => $row['doctor_id'],
            'first_name' => $row['first_name'],
            'last_name' => $row['last_name'],
            'email' => $row['email'],
            'phone_no' => $row['phone_no'],
            'specialty' => $row['specialty'],
            'experience' => $row['experience'],
            'hospital' => $row['hospital'],
            'clinic' => $row['clinic'],
            'city' => $row['city'],
            'verified' => (int)$row['verified']
        ];
    }
}

echo json_encode([
    'success' => true,
    'doctors' => $doctors
]);

$conn->close();
?>
