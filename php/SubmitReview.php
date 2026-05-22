<?php
require_once 'config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$appointment_id = intval($data['appointment_id']);
$patient_id = intval($data['patient_id']);
$doctor_id = intval($data['doctor_id']);
$rating = intval($data['rating']);
$review_text = trim($data['review_text'] ?? '');

if ($rating < 1 || $rating > 5) {
    echo json_encode(['success' => false, 'error' => 'Rating must be between 1 and 5']);
    exit;
}

// Verify appointment is completed
$stmt = $conn->prepare("
    SELECT status FROM appointments 
    WHERE appointment_id = ? AND patient_id = ? AND doctor_id = ? AND status = 'confirmed'
");
$stmt->bind_param("iii", $appointment_id, $patient_id, $doctor_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'error' => 'Invalid or incomplete appointment']);
    exit;
}

// Check if already reviewed
$stmt = $conn->prepare("SELECT review_id FROM reviews WHERE appointment_id = ?");
$stmt->bind_param("i", $appointment_id);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    echo json_encode(['success' => false, 'error' => 'Already reviewed']);
    exit;
}

// Insert review
$stmt = $conn->prepare("INSERT INTO reviews (appointment_id, patient_id, doctor_id, rating, review_text) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("iiiis", $appointment_id, $patient_id, $doctor_id, $rating, $review_text);

if ($stmt->execute()) {
    // Update doctor rating
    $stmt = $conn->prepare("SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews WHERE doctor_id = ?");
    $stmt->bind_param("i", $doctor_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    
    $avg_rating = round($result['avg_rating'], 1);
    $total_reviews = $result['total'];
    
    $stmt = $conn->prepare("UPDATE doctors SET average_rating = ?, total_reviews = ? WHERE doctor_id = ?");
    $stmt->bind_param("dii", $avg_rating, $total_reviews, $doctor_id);
    $stmt->execute();
    
    echo json_encode(['success' => true, 'message' => 'Review submitted successfully']);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to submit review']);
}

$stmt->close();
$conn->close();
?>
