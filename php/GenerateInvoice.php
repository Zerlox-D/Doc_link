<?php
require 'config.php';
require('fpdf186/fpdf.php');

if (!isset($_GET['invoice_number'])) {
    die('Invoice number required');
}

$invoice_number = $_GET['invoice_number'];

// Fetch payment details
$sql = "SELECT 
    p.*,
    CONCAT(pat.first_name, ' ', pat.last_name) as patient_name,
    pat.email as patient_email,
    pat.phone_no as patient_phone,
    CONCAT(d.first_name, ' ', d.last_name) as doctor_name,
    d.specialty,
    d.hospital,
    a.appointment_date,
    a.appointment_time
FROM payments p
JOIN patients pat ON p.patient_id = pat.patient_id
JOIN doctors d ON p.doctor_id = d.doctor_id
JOIN appointments a ON p.appointment_id = a.appointment_id
WHERE p.invoice_number = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $invoice_number);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die('Invoice not found');
}

$data = $result->fetch_assoc();

// Create PDF
$pdf = new FPDF();
$pdf->AddPage();

// Header
$pdf->SetFont('Arial', 'B', 20);
$pdf->SetTextColor(5, 150, 105);
$pdf->Cell(0, 10, 'DOC.LINK', 0, 1, 'C');

$pdf->SetFont('Arial', '', 10);
$pdf->SetTextColor(0, 0, 0);
$pdf->Cell(0, 5, 'Medical Appointment Payment Invoice', 0, 1, 'C');
$pdf->Ln(10);

// Invoice Details
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 8, 'INVOICE', 0, 1);
$pdf->SetFont('Arial', '', 10);
$pdf->Cell(50, 6, 'Invoice Number:', 0, 0);
$pdf->Cell(0, 6, $data['invoice_number'], 0, 1);
$pdf->Cell(50, 6, 'Transaction ID:', 0, 0);
$pdf->Cell(0, 6, $data['transaction_id'], 0, 1);
$pdf->Cell(50, 6, 'Date:', 0, 0);
$pdf->Cell(0, 6, date('d M Y, h:i A', strtotime($data['payment_date'])), 0, 1);
$pdf->Ln(5);

// Patient Details
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 8, 'PATIENT DETAILS', 0, 1);
$pdf->SetFont('Arial', '', 10);
$pdf->Cell(50, 6, 'Name:', 0, 0);
$pdf->Cell(0, 6, $data['patient_name'], 0, 1);
$pdf->Cell(50, 6, 'Email:', 0, 0);
$pdf->Cell(0, 6, $data['patient_email'], 0, 1);
$pdf->Cell(50, 6, 'Phone:', 0, 0);
$pdf->Cell(0, 6, $data['patient_phone'], 0, 1);
$pdf->Ln(5);

// Doctor Details
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 8, 'DOCTOR DETAILS', 0, 1);
$pdf->SetFont('Arial', '', 10);
$pdf->Cell(50, 6, 'Name:', 0, 0);
$pdf->Cell(0, 6, 'Dr. ' . $data['doctor_name'], 0, 1);
$pdf->Cell(50, 6, 'Specialty:', 0, 0);
$pdf->Cell(0, 6, $data['specialty'], 0, 1);
$pdf->Cell(50, 6, 'Hospital:', 0, 0);
$pdf->Cell(0, 6, $data['hospital'], 0, 1);
$pdf->Ln(5);

// Appointment Details
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 8, 'APPOINTMENT DETAILS', 0, 1);
$pdf->SetFont('Arial', '', 10);
$pdf->Cell(50, 6, 'Date:', 0, 0);
$pdf->Cell(0, 6, date('d M Y', strtotime($data['appointment_date'])), 0, 1);
$pdf->Cell(50, 6, 'Time:', 0, 0);
$pdf->Cell(0, 6, date('h:i A', strtotime($data['appointment_time'])), 0, 1);
$pdf->Ln(10);

// Payment Summary Table
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 8, 'PAYMENT SUMMARY', 0, 1);

$pdf->SetFillColor(5, 150, 105);
$pdf->SetTextColor(255, 255, 255);
$pdf->SetFont('Arial', 'B', 10);
$pdf->Cell(120, 8, 'Description', 1, 0, 'L', true);
$pdf->Cell(70, 8, 'Amount', 1, 1, 'R', true);

$pdf->SetTextColor(0, 0, 0);
$pdf->SetFont('Arial', '', 10);
$pdf->Cell(120, 8, 'Consultation Fee', 1, 0);
$pdf->Cell(70, 8, 'Rs. ' . number_format($data['amount'], 2), 1, 1, 'R');

$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(120, 10, 'Total Paid', 1, 0);
$pdf->SetTextColor(5, 150, 105);
$pdf->Cell(70, 10, 'Rs. ' . number_format($data['amount'], 2), 1, 1, 'R');

$pdf->Ln(5);

// Payment Method
$pdf->SetTextColor(0, 0, 0);
$pdf->SetFont('Arial', '', 10);
$pdf->Cell(50, 6, 'Payment Method:', 0, 0);
$pdf->Cell(0, 6, ucfirst(str_replace('_', ' ', $data['payment_method'])), 0, 1);
$pdf->Cell(50, 6, 'Status:', 0, 0);
$pdf->SetTextColor(5, 150, 105);
$pdf->SetFont('Arial', 'B', 10);
$pdf->Cell(0, 6, 'PAID', 0, 1);

// Footer
$pdf->Ln(15);
$pdf->SetTextColor(100, 100, 100);
$pdf->SetFont('Arial', 'I', 8);
$pdf->Cell(0, 5, 'Thank you for choosing Doc.Link!', 0, 1, 'C');
$pdf->Cell(0, 5, 'This is a computer-generated invoice and does not require a signature.', 0, 1, 'C');

$pdf->Output('D', 'Invoice_' . $invoice_number . '.pdf');

$stmt->close();
$conn->close();
?>