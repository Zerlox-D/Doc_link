<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include 'config.php';

if (isset($_GET['doctor_id']) && isset($_GET['date'])) {
    $doctor_id = intval($_GET['doctor_id']);
    $date = $_GET['date'];
    
    // Get day of week from date
    $day_of_week = strtolower(date('l', strtotime($date)));
    
    // Get doctor's availability for that day
    $stmt = $conn->prepare("SELECT start_time, end_time, slot_duration, is_available 
                           FROM fees_and_availability 
                           WHERE doctor_id = ? AND day_of_week = ?");
    $stmt->bind_param("is", $doctor_id, $day_of_week);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        if (!$row['is_available']) {
            echo json_encode([
                'available' => false,
                'message' => 'Doctor is not available on this day'
            ]);
            exit;
        }
        
        $start_time = $row['start_time'];
        $end_time = $row['end_time'];
        $slot_duration = $row['slot_duration'] ?? 30;
        
        // Generate all possible slots
        $slots = [];
        $current_time = strtotime($start_time);
        $end_timestamp = strtotime($end_time);
        
        while ($current_time < $end_timestamp) {
            $slot_time = date('H:i:s', $current_time);
            $slots[] = $slot_time;
            $current_time += ($slot_duration * 60);
        }
        
        // Get already booked slots
        $stmt2 = $conn->prepare("SELECT appointment_time FROM appointments 
                                WHERE doctor_id = ? AND appointment_date = ?");
        $stmt2->bind_param("is", $doctor_id, $date);
        $stmt2->execute();
        $result2 = $stmt2->get_result();
        
        $booked_slots = [];
        while ($booked_row = $result2->fetch_assoc()) {
            $booked_slots[] = $booked_row['appointment_time'];
        }
        
        // Filter out booked slots and format
        $available_slots = [];
        foreach ($slots as $slot) {
            if (!in_array($slot, $booked_slots)) {
                $available_slots[] = [
                    'time' => $slot,
                    'formatted_time' => date('g:i A', strtotime($slot))
                ];
            }
        }
        
        echo json_encode([
            'available' => true,
            'slots' => $available_slots
        ]);
        
        $stmt2->close();
    } else {
        echo json_encode([
            'available' => false
        ]);
    }
    
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'Doctor ID and date are required']);
}
?>