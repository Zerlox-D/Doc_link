<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require 'config.php';

// Get total doctors
$doctorsResult = $conn->query("SELECT COUNT(*) as count FROM doctors");
$totalDoctors = $doctorsResult->fetch_assoc()['count'];

// Get total patients
$patientsResult = $conn->query("SELECT COUNT(*) as count FROM patients");
$totalPatients = $patientsResult->fetch_assoc()['count'];

// Get appointment counts by status
$pendingResult = $conn->query("SELECT COUNT(*) as count FROM appointments WHERE status = 'pending'");
$pendingAppointments = $pendingResult->fetch_assoc()['count'];

$confirmedResult = $conn->query("SELECT COUNT(*) as count FROM appointments WHERE status = 'confirmed'");
$confirmedAppointments = $confirmedResult->fetch_assoc()['count'];

$completedResult = $conn->query("SELECT COUNT(*) as count FROM appointments WHERE status = 'completed'");
$completedAppointments = $completedResult->fetch_assoc()['count'];

// Get pending verifications
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
