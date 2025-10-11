<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require 'config.php';

$patient_id = isset($_GET['patient_id']) ? intval($_GET['patient_id']) : 0;

if ($patient_id <= 0) {
    echo json_encode([]);
    exit;
}

$query = "
    SELECT 
        a.appointment_id,
        a.patient_name,
        a.appointment_date,
        a.appointment_time,
        a.mode_of_booking,
        a.booking_reason,
        a.status,
        CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
        d.specialty
    FROM 
        appointments a
    INNER JOIN 
        doctors d ON a.doctor_id = d.doctor_id
    WHERE 
        a.patient_id = ?
    ORDER BY 
        a.appointment_date DESC, a.appointment_time DESC
";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $patient_id);
$stmt->execute();
$result = $stmt->get_result();

$appointments = [];
while ($row = $result->fetch_assoc()) {
    $appointments[] = $row;
}

echo json_encode($appointments);

$stmt->close();
$conn->close();
