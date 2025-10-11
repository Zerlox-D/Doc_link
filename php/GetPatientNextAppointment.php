<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require 'config.php';

$patient_id = isset($_GET['patient_id']) ? intval($_GET['patient_id']) : 0;

if ($patient_id <= 0) {
    echo json_encode(['error' => 'Invalid patient ID']);
    exit;
}

// Get the next upcoming appointment with doctor details
$query = "
    SELECT 
        a.appointment_id,
        a.appointment_date,
        a.appointment_time,
        a.mode_of_booking,
        a.booking_reason,
        CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
        d.specialty
    FROM 
        appointments a
    INNER JOIN 
        doctors d ON a.doctor_id = d.doctor_id
    WHERE 
        a.patient_id = ?
        AND CONCAT(a.appointment_date, ' ', a.appointment_time) >= NOW()
    ORDER BY 
        a.appointment_date ASC, a.appointment_time ASC
    LIMIT 1
";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $patient_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(['error' => 'No upcoming appointments']);
}

$stmt->close();
$conn->close();
