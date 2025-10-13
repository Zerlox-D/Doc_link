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

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
    exit;
}

// Check which required fields are missing
$missing = [];
if (empty($data['firstName'])) $missing[] = 'firstName';
if (empty($data['lastName'])) $missing[] = 'lastName';
if (empty($data['email'])) $missing[] = 'email';
if (empty($data['phone'])) $missing[] = 'phone';
if (empty($data['password'])) $missing[] = 'password';
if (empty($data['licenseNumber'])) $missing[] = 'licenseNumber';
if (empty($data['yearsOfExperience'])) $missing[] = 'yearsOfExperience';
if (empty($data['dateOfBirth'])) $missing[] = 'dateOfBirth';
if (empty($data['gender'])) $missing[] = 'gender';

if (count($missing) > 0) {
    echo json_encode([
        'success' => false, 
        'error' => 'Missing required fields: ' . implode(', ', $missing),
        'received_data' => array_keys($data)
    ]);
    exit;
}

// Check if email already exists
$email = $conn->real_escape_string($data['email']);
$checkEmail = $conn->prepare("SELECT doctor_id FROM doctors WHERE email = ?");
$checkEmail->bind_param("s", $email);
$checkEmail->execute();
$result = $checkEmail->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'error' => 'Email already registered']);
    $checkEmail->close();
    $conn->close();
    exit;
}
$checkEmail->close();

// Check if license number already exists
$license_no = $conn->real_escape_string($data['licenseNumber']);
$checkLicense = $conn->prepare("SELECT doctor_id FROM doctors WHERE license_no = ?");
$checkLicense->bind_param("s", $license_no);
$checkLicense->execute();
$resultLicense = $checkLicense->get_result();

if ($resultLicense->num_rows > 0) {
    echo json_encode(['success' => false, 'error' => 'License number already registered']);
    $checkLicense->close();
    $conn->close();
    exit;
}
$checkLicense->close();

// Hash the password
$password = $conn->real_escape_string($data['password']);

// Prepare data
$first_name = $conn->real_escape_string($data['firstName']);
$last_name = $conn->real_escape_string($data['lastName']);
$phone_no = $conn->real_escape_string($data['phone']);
$dob = $conn->real_escape_string($data['dateOfBirth']);
$gender = $conn->real_escape_string($data['gender']);

// Handle specializations (array or string)
$specialty = '';
if (isset($data['specializations'])) {
    if (is_array($data['specializations'])) {
        $specialty = implode(', ', $data['specializations']);
    } else {
        $specialty = $data['specializations'];
    }
}
$specialty = $conn->real_escape_string($specialty);

$experience = intval($data['yearsOfExperience']);
$hospital = isset($data['hospitalsClinic']) ? $conn->real_escape_string($data['hospitalsClinic']) : '';
$clinic = isset($data['clinic']) ? $conn->real_escape_string($data['clinic']) : '';
$city = isset($data['city']) ? $conn->real_escape_string($data['city']) : '';

// Doctors are unverified by default
$verified = 0;

// Insert doctor
$stmt = $conn->prepare("INSERT INTO doctors (first_name, last_name, email, phone_no, dob, gender, license_no, specialty, experience, hospital, clinic, city, password, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssssssdssssi", $first_name, $last_name, $email, $phone_no, $dob, $gender, $license_no, $specialty, $experience, $hospital, $clinic, $city, $password, $verified);

if ($stmt->execute()) {
    $doctor_id = $stmt->insert_id;
    echo json_encode([
        'success' => true,
        'message' => 'Doctor registered successfully. Your account is pending verification.',
        'doctor_id' => $doctor_id,
        'verified' => false
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'Registration failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
