<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require 'config.php';

$doctor_id = isset($_GET['doctor_id']) ? intval($_GET['doctor_id']) : 0;

if ($doctor_id <= 0) {
    echo json_encode([]);
    exit;
}

$query = "
    SELECT 
        a.appointment_id,
        a.patient_id,
        a.patient_name,
        a.booking_reason,
        a.appointment_date,
        a.appointment_time,
        a.mode_of_booking,
        CONCAT(p.first_name, ' ', p.last_name) AS booked_by
    FROM 
        appointments a
    LEFT JOIN 
        patients p ON a.patient_id = p.patient_id
    WHERE 
        a.doctor_id = ? 
        AND a.status = 'pending'
        AND a.appointment_date >= CURDATE()
    ORDER BY 
        a.appointment_date ASC, a.appointment_time ASC
";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $doctor_id);
$stmt->execute();
$result = $stmt->get_result();

$requests = [];
while ($row = $result->fetch_assoc()) {
    $requests[] = $row;
}

echo json_encode($requests);

$stmt->close();
$conn->close();
