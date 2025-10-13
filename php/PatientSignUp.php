<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($data['firstName']) || !isset($data['lastName']) || !isset($data['email']) || 
    !isset($data['phone']) || !isset($data['password']) || !isset($data['dateOfBirth']) || 
    !isset($data['gender']) || !isset($data['city'])) {
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

// Hash the password
$password = $conn->real_escape_string($data['password']);

// Prepare data
$first_name = $conn->real_escape_string($data['firstName']);
$last_name = $conn->real_escape_string($data['lastName']);
$phone_no = $conn->real_escape_string($data['phone']);
$dob = $conn->real_escape_string($data['dateOfBirth']);
$gender = $conn->real_escape_string($data['gender']);
$city = $conn->real_escape_string($data['city']);

// Insert patient
$stmt = $conn->prepare("INSERT INTO patients (first_name, last_name, email, phone_no, dob, gender, city, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssssss", $first_name, $last_name, $email, $phone_no, $dob, $gender, $city, $password);

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
