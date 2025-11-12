<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include 'config.php';

if (isset($_GET['id'])) {
    $doctor_id = intval($_GET['id']);
    
    // Get doctor information
    $stmt = $conn->prepare("SELECT * FROM doctors WHERE doctor_id = ? AND verified = 1");
    $stmt->bind_param("i", $doctor_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        $doctor = $row;
        $doctor['average_rating'] = number_format(floatval($doctor['average_rating']), 1, '.','');

        // Get availability information
        $stmt2 = $conn->prepare("SELECT * FROM fees_and_availability WHERE doctor_id = ? ORDER BY FIELD(day_of_week, 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')");
        $stmt2->bind_param("i", $doctor_id);
        $stmt2->execute();
        $result2 = $stmt2->get_result();
        
        $availability = [];
        while ($avail_row = $result2->fetch_assoc()) {
            $availability[] = $avail_row;
        }
        
        echo json_encode([
            "doctor" => $doctor,
            "availability" => $availability
        ]);
        
        $stmt2->close();
    } else {
        echo json_encode(["error" => "Doctor not found or not verified"]);
    }
    
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "No ID provided"]);
}
?>
