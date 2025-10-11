<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['patient_id']) && isset($data['doctor_id']) && 
    isset($data['appointment_date']) && isset($data['appointment_time']) && 
    isset($data['mode_of_booking'])) {
    
    $patient_id = intval($data['patient_id']);
    $doctor_id = intval($data['doctor_id']);
    $patient_name = $conn->real_escape_string($data['patient_name']);
    $appointment_date = $data['appointment_date'];
    $appointment_time = $data['appointment_time'];
    $mode_of_booking = $conn->real_escape_string($data['mode_of_booking']);
    $booking_reason = isset($data['booking_reason']) ? $conn->real_escape_string($data['booking_reason']) : null;
    
    $conn->begin_transaction();
    
    try {
        $check_stmt = $conn->prepare("SELECT appointment_id FROM appointments 
                                      WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ?");
        $check_stmt->bind_param("iss", $doctor_id, $appointment_date, $appointment_time);
        $check_stmt->execute();
        $check_result = $check_stmt->get_result();
        
        if ($check_result->num_rows > 0) {
            throw new Exception('This time slot is already booked');
        }
        $check_stmt->close();
        
        $insert_stmt = $conn->prepare("INSERT INTO appointments 
                                        (patient_id, doctor_id, patient_name, booking_reason, appointment_date, appointment_time, mode_of_booking, status) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')");
        $insert_stmt->bind_param("iisssss", $patient_id, $doctor_id, $patient_name, $booking_reason, $appointment_date, $appointment_time, $mode_of_booking);
        $insert_stmt->execute();
        $appointment_id = $conn->insert_id;
        $insert_stmt->close();
        
        $conn->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Appointment booked successfully',
            'appointment_id' => $appointment_id
        ]);
        
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
    
    $conn->close();
} else {
    echo json_encode(['error' => 'Missing required fields']);
}
?>