<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require 'config.php';

$doctor_id = isset($_GET['doctor_id']) ? intval($_GET['doctor_id']) : 0;
if ($doctor_id <= 0) { echo json_encode([]); exit; }

$stmt = $conn->prepare("SELECT appointment_id, patient_id, doctor_id, patient_name, booking_reason, appointment_date, appointment_time, mode_of_booking
                        FROM appointments
                        WHERE doctor_id = ?
                          AND status = 'confirmed'
                          AND appointment_date >= CURDATE()
                        ORDER BY appointment_date ASC, appointment_time ASC
                        LIMIT 50");
$stmt->bind_param("i", $doctor_id);
$stmt->execute();
$res = $stmt->get_result();

$rows = [];
while ($r = $res->fetch_assoc()) { $rows[] = $r; }

echo json_encode($rows);
