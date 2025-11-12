<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if (!isset($_GET['doctor_id'])) {
    echo json_encode(['success' => false, 'error' => 'Doctor ID required']);
    exit;
}

$doctor_id = intval($_GET['doctor_id']);
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

// Get reviews with patient names
$stmt = $conn->prepare("
    SELECT r.review_id, r.rating, r.review_text, r.created_at, 
           p.first_name, p.last_name
    FROM reviews r
    JOIN patients p ON r.patient_id = p.patient_id
    WHERE r.doctor_id = ?
    ORDER BY r.created_at DESC
    LIMIT ? OFFSET ?
");
$stmt->bind_param("iii", $doctor_id, $limit, $offset);
$stmt->execute();
$result = $stmt->get_result();

$reviews = [];
while ($row = $result->fetch_assoc()) {
    $reviews[] = [
        'review_id' => $row['review_id'],
        'rating' => $row['rating'],
        'review_text' => $row['review_text'],
        'patient_name' => $row['first_name'] . ' ' . substr($row['last_name'], 0, 1) . '.', // Privacy: show only first initial of last name
        'date' => date('M j, Y', strtotime($row['created_at']))
    ];
}

// Get rating statistics
$stmt = $conn->prepare("
    SELECT 
        AVG(rating) as average_rating,
        COUNT(*) as total_reviews,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
    FROM reviews WHERE doctor_id = ?
");
$stmt->bind_param("i", $doctor_id);
$stmt->execute();
$stats = $stmt->get_result()->fetch_assoc();

echo json_encode([
    'success' => true,
    'reviews' => $reviews,
    'statistics' => [
        'average_rating' => round(floatval($stats['average_rating']), 1),
        'total_reviews' => intval($stats['total_reviews']),
        'rating_distribution' => [
            5 => $stats['five_star'],
            4 => $stats['four_star'],
            3 => $stats['three_star'],
            2 => $stats['two_star'],
            1 => $stats['one_star']
        ]
    ]
]);

$stmt->close();
$conn->close();
?>
