<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['doctor_id']) || !isset($data['availability'])) {
    echo json_encode(['success' => false, 'error' => 'Doctor ID and availability required']);
    exit;
}

$doctor_id = intval($data['doctor_id']);
$availability = $data['availability'];

$conn->begin_transaction();

try {
    // Delete all existing availability for this doctor
    $deleteStmt = $conn->prepare("DELETE FROM fees_and_availability WHERE doctor_id = ?");
    $deleteStmt->bind_param("i", $doctor_id);
    $deleteStmt->execute();
    $deleteStmt->close();

    // Insert new availability records
    $insertStmt = $conn->prepare("INSERT INTO fees_and_availability (doctor_id, day_of_week, is_available, start_time, end_time, slot_duration, consultation_fee, home_visit_available, home_visit_fee) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

    foreach ($availability as $avail) {
        $day_of_week = $conn->real_escape_string($avail['day_of_week']);
        $is_available = intval($avail['is_available']);
        $start_time = $avail['start_time'];
        $end_time = $avail['end_time'];
        $slot_duration = intval($avail['slot_duration']);
        $consultation_fee = floatval($avail['consultation_fee']);
        $home_visit_available = intval($avail['home_visit_available']);
        $home_visit_fee = floatval($avail['home_visit_fee']);

        $insertStmt->bind_param("isissidid", $doctor_id, $day_of_week, $is_available, $start_time, $end_time, $slot_duration, $consultation_fee, $home_visit_available, $home_visit_fee);
        $insertStmt->execute();
    }

    $insertStmt->close();
    $conn->commit();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
