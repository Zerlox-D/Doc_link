<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require 'config.php';

$search = isset($_GET['q']) ? $conn->real_escape_string($_GET['q']) : '';

$sql = "SELECT doctor_id, first_name, last_name, city, specialty, hospital, experience, average_rating, total_reviews
FROM doctors
WHERE verified = 1";

if (!empty($search)) {
    $sql .= " AND (first_name LIKE '%$search%'
    OR last_name LIKE '%$search%'
    OR city LIKE '%$search%'
    OR specialty LIKE '%$search%'
    OR hospital LIKE '%$search%'
    )";
}

$sql .= " ORDER BY average_rating DESC, total_reviews DESC";

$result = $conn->query($sql);

$doctors = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $doctors[] = [
            "doctor_id" => $row["doctor_id"],
            "name" => $row["first_name"] . " " . $row["last_name"],
            "city" => $row["city"],
            "specialty" => $row["specialty"],
            "hospital" => $row["hospital"],
            "experience" => $row["experience"],
            'average_rating' => floatval($row['average_rating']),
            'total_reviews' => intval($row['total_reviews'])
        ];
    }
}

echo json_encode($doctors);

$conn->close();
