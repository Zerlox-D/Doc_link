<?php
require 'config.php';
header('Content-Type: application/json');

if (!isset($_GET['patient_id'])) {
    echo json_encode(['success' => false, 'error' => 'Patient ID required']);
    exit;
}

$patient_id = intval($_GET['patient_id']);

$sql = "SELECT DISTINCT
    a.appointment_id,
    a.patient_id,
    a.doctor_id,
    a.patient_name,
    a.appointment_date,
    a.appointment_time,
    a.booking_reason,
    a.status,
    a.payment_id,
    a.mode_of_booking,
    CONCAT(d.first_name, ' ', d.last_name) as doctor_name,
    d.specialty,
    d.hospital,
    d.city,
    COALESCE(
        (SELECT consultation_fee
         FROM fees_and_availability
         WHERE doctor_id = d.doctor_id
         LIMIT 1),
        500
    ) as fee,
    p.payment_status,
    p.payment_method,
    p.transaction_id,
    p.invoice_number,
    p.amount as paid_amount,
    r.review_id,
    r.rating,
    r.review_text
FROM appointments a
JOIN doctors d ON a.doctor_id = d.doctor_id
LEFT JOIN payments p ON a.payment_id = p.payment_id
LEFT JOIN reviews r ON a.appointment_id = r.appointment_id
WHERE a.patient_id = ?
ORDER BY a.appointment_date DESC, a.appointment_time DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $patient_id);
$stmt->execute();
$result = $stmt->get_result();

$appointments = [];
while ($row = $result->fetch_assoc()) {
    $row['has_reviewed'] = ($row['review_id'] !== null);
    $appointments[] = $row;
}

echo json_encode([
    'success' => true,
    'appointments' => $appointments
]);

$stmt->close();
$conn->close();
?>
