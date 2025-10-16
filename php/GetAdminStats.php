<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require 'config.php';

$doctorsResult = $conn->query("SELECT COUNT(*) as count FROM doctors");
$totalDoctors = $doctorsResult->fetch_assoc()['count'];

$patientsResult = $conn->query("SELECT COUNT(*) as count FROM patients");
$totalPatients = $patientsResult->fetch_assoc()['count'];

$pendingResult = $conn->query("SELECT COUNT(*) as count FROM appointments WHERE status = 'pending'");
$pendingAppointments = $pendingResult->fetch_assoc()['count'];

$confirmedResult = $conn->query("SELECT COUNT(*) as count FROM appointments WHERE status = 'confirmed'");
$confirmedAppointments = $confirmedResult->fetch_assoc()['count'];

$completedResult = $conn->query("SELECT COUNT(*) as count FROM appointments WHERE status = 'completed'");
$completedAppointments = $completedResult->fetch_assoc()['count'];

$verificationResult = $conn->query("SELECT COUNT(*) as count FROM doctors WHERE verified = 0");
$pendingVerifications = $verificationResult->fetch_assoc()['count'];

echo json_encode([
    'success' => true,
    'stats' => [
        'totalDoctors' => (int)$totalDoctors,
        'totalPatients' => (int)$totalPatients,
        'pendingAppointments' => (int)$pendingAppointments,
        'confirmedAppointments' => (int)$confirmedAppointments,
        'completedAppointments' => (int)$completedAppointments,
        'pendingVerifications' => (int)$pendingVerifications
    ]
]);

$conn->close();
?>
