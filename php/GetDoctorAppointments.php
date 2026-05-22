<?php
require 'config.php';
header('Content-Type: application/json');

if (!isset($_GET['doctor_id'])) {
    echo json_encode(['error' => 'Doctor ID required']);
    exit;
}

$doctor_id = intval($_GET['doctor_id']);

// Get appointment type from query parameter (default to 'upcoming')
$type = isset($_GET['type']) ? $_GET['type'] : 'upcoming';

if ($type === 'completed') {
    // Fetch COMPLETED appointments (past dates with payment confirmed)
    $stmt = $conn->prepare("SELECT 
        a.appointment_id, 
        a.patient_id, 
        a.doctor_id, 
        a.patient_name, 
        a.booking_reason, 
        a.appointment_date, 
        a.appointment_time, 
        a.mode_of_booking,
        a.payment_id,
        IFNULL(pr.prescription_id, NULL) as prescription_id
    FROM appointments a
    LEFT JOIN prescriptions pr ON a.appointment_id = pr.appointment_id
    WHERE a.doctor_id = ?
        AND a.status = 'confirmed'
        AND a.payment_id IS NOT NULL
        AND a.appointment_date < CURDATE()
    ORDER BY a.appointment_date DESC, a.appointment_time DESC
    LIMIT 50");
} else {
    // Fetch UPCOMING appointments (original logic)
    $stmt = $conn->prepare("SELECT 
        appointment_id, 
        patient_id, 
        doctor_id, 
        patient_name, 
        booking_reason, 
        appointment_date, 
        appointment_time, 
        mode_of_booking
    FROM appointments
    WHERE doctor_id = ?
        AND status = 'confirmed'
        AND appointment_date >= CURDATE()
    ORDER BY appointment_date ASC, appointment_time ASC
    LIMIT 50");
}

$stmt->bind_param("i", $doctor_id);
$stmt->execute();
$res = $stmt->get_result();

$rows = [];
while ($r = $res->fetch_assoc()) { 
    $rows[] = $r; 
}

echo json_encode($rows);

$stmt->close();
$conn->close();
?>
