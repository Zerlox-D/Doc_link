<?php
require 'config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if ($data === null) {
    echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
    exit;
}

// Validate required fields
if (!isset($data['firstName']) || !isset($data['lastName']) || !isset($data['email']) || 
    !isset($data['phone']) || !isset($data['password']) || !isset($data['dateOfBirth']) || 
    !isset($data['gender']) || !isset($data['city']) || !isset($data['state'])) {
    echo json_encode(['success' => false, 'error' => 'All required fields must be filled']);
    exit;
}

// Check if email already exists
$email = $conn->real_escape_string($data['email']);
$checkEmail = $conn->prepare("SELECT patient_id FROM patients WHERE email = ?");
$checkEmail->bind_param("s", $email);
$checkEmail->execute();
$result = $checkEmail->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'error' => 'Email already registered']);
    exit;
}

// Prepare data
$first_name = $conn->real_escape_string($data['firstName']);
$last_name = $conn->real_escape_string($data['lastName']);
$phone_no = $conn->real_escape_string($data['phone']);
$dob = $conn->real_escape_string($data['dateOfBirth']);
$gender = $conn->real_escape_string($data['gender']);
$password = $conn->real_escape_string($data['password']);
$city = $conn->real_escape_string($data['city']);
$state = $conn->real_escape_string($data['state']);
$emergency_contactname = $conn->real_escape_string($data['emergencyContact']);
$emergency_phone = $conn->real_escape_string($data['emergencyPhone']);

// Insert patient
$stmt = $conn->prepare("INSERT INTO patients (first_name, last_name, email, phone_no, dob, gender, city, state, emgncy_contactname, emgncy_contactno, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssssssss", $first_name, $last_name, $email, $phone_no, $dob, $gender, $city, $state, $emergency_contactname, $emergency_phone, $password);
if ($stmt->execute()) {
    $patient_id = $stmt->insert_id;
    echo json_encode([
        'success' => true,
        'message' => 'Patient registered successfully',
        'patient_id' => $patient_id
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'Registration failed: ' . $conn->error]);
}

$stmt->close();
$conn->close();
