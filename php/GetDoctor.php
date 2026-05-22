<?php
require 'config.php';
header("Content-Type: application/json");

if (isset($_GET['id'])) {
    $doctor_id = intval($_GET['id']);

    $stmt = $conn->prepare("SELECT * FROM doctors WHERE doctor_id = ?");
    $stmt->bind_param("i", $doctor_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode($row);
    } else {
        echo json_encode(["error" => "No doctor found"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "No ID provided"]);
}
?>
