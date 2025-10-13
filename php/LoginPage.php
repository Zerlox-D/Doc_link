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

if (isset($data['email']) && isset($data['password']) && isset($data['userType'])) {
    $email = $conn->real_escape_string($data['email']);
    $password = $data['password'];
    $userType = $data['userType'];
    
    if ($userType === 'doctor') {
        $stmt = $conn->prepare("SELECT doctor_id, first_name, last_name, email, password, verified FROM doctors WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($row = $result->fetch_assoc()) {
            if ($password === $row['password']) {
                echo json_encode([
                    'success' => true,
                    'userType' => 'doctor',
                    'user' => [
                        'id' => $row['doctor_id'],
                        'first_name' => $row['first_name'],
                        'last_name' => $row['last_name'],
                        'email' => $row['email'],
                        'verified' => (int)$row['verified']
                    ]
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid email or password'
                ]);
            }
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'No doctor account found with this email'
            ]);
        }
        $stmt->close();
        
    } else if ($userType === 'patient') {
        $stmt = $conn->prepare("SELECT patient_id, first_name, last_name, email, password FROM patients WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($row = $result->fetch_assoc()) {
            if ($password === $row['password']) {
                echo json_encode([
                    'success' => true,
                    'userType' => 'patient',
                    'user' => [
                        'id' => $row['patient_id'],
                        'first_name' => $row['first_name'],
                        'last_name' => $row['last_name'],
                        'email' => $row['email']
                    ]
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid email or password'
                ]);
            }
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'No patient account found with this email'
                ]);
        }
        $stmt->close();
        
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Invalid user type'
        ]);
    }
    
    $conn->close();
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Email, password, and user type are required'
    ]);
}
?>