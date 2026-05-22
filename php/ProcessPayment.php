<?php
require 'config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['appointment_id']) || !isset($data['patient_id']) || 
    !isset($data['doctor_id']) || !isset($data['amount']) || 
    !isset($data['payment_method'])) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

$appointment_id = intval($data['appointment_id']);
$patient_id = intval($data['patient_id']);
$doctor_id = intval($data['doctor_id']);
$amount = floatval($data['amount']);
$payment_method = $conn->real_escape_string($data['payment_method']);

$upi_id = isset($data['upi_id']) ? $conn->real_escape_string($data['upi_id']) : null;
$card_last4 = isset($data['card_last4']) ? $conn->real_escape_string($data['card_last4']) : null;
$card_type = isset($data['card_type']) ? $conn->real_escape_string($data['card_type']) : null;
$bank_name = isset($data['bank_name']) ? $conn->real_escape_string($data['bank_name']) : null;

// Generate unique IDs
$transaction_id = 'TXN' . time() . rand(1000, 9999);
$invoice_number = 'INV' . date('Ymd') . rand(10000, 99999);

$conn->begin_transaction();

try {
    // Insert payment
    $stmt = $conn->prepare("INSERT INTO payments (appointment_id, patient_id, doctor_id, amount, payment_method, payment_status, transaction_id, upi_id, card_last4, card_type, bank_name, invoice_number) VALUES (?, ?, ?, ?, ?, 'success', ?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param("iiidsssssss", $appointment_id, $patient_id, $doctor_id, $amount, $payment_method, $transaction_id, $upi_id, $card_last4, $card_type, $bank_name, $invoice_number);
    
    if (!$stmt->execute()) {
        throw new Exception('Payment insert failed');
    }
    
    $payment_id = $stmt->insert_id;
    $stmt->close();
    
    // Update appointment
    $updateStmt = $conn->prepare("UPDATE appointments SET payment_id = ? WHERE appointment_id = ?");
    $updateStmt->bind_param("ii", $payment_id, $appointment_id);
    
    if (!$updateStmt->execute()) {
        throw new Exception('Appointment update failed');
    }
    $updateStmt->close();
    
    $conn->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Payment successful',
        'transaction_id' => $transaction_id,
        'invoice_number' => $invoice_number
    ]);
    
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
?>
