import React, { useState,useEffect } from 'react';
import '../css/PaymentGatewayStyle.css';

export default function PaymentGateway({ appointment, onSuccess, onCancel }) {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [bankName, setBankName] = useState('');

  // useEffect(() => {
  //   document.body.style.overflow = 'hidden';
    
  //   return () => {
  //     document.body.style.overflow = 'unset';
  //   };
  // }, []);

  const handlePayment = async () => {
    setLoading(true);

      const paymentData = {
        appointment_id: appointment.appointment_id,
        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id,
        amount: appointment.fee,
        payment_method: paymentMethod,
        upi_id: paymentMethod === 'upi' ? upiId : null,
        card_last4: (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') ? cardNumber.slice(-4) : null,
        card_type: paymentMethod === 'credit_card' ? 'Credit' : paymentMethod === 'debit_card' ? 'Debit' : null,
        bank_name: paymentMethod === 'net_banking' ? bankName : null
      };

      try {
        const response = await fetch('http://localhost/Doc_Link/php/ProcessPayment.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentData)
        });

        const data = await response.json();
        
        if (data.success) {
          alert(`Payment Successful!\nTransaction ID: ${data.transaction_id}`);
          onSuccess();
        } else {
          alert('Payment failed: ' + data.error);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
  };

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <div className="payment-header">
          <h2>Complete Payment</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <div className="payment-summary">
          <p><strong>Doctor:</strong> Dr. {appointment.doctor_name}</p>
          <p><strong>Date:</strong> {appointment.appointment_date}</p>
          <p><strong>Time:</strong> {appointment.appointment_time}</p>
          <p className="amount"><strong>Amount:</strong> ₹{appointment.fee}</p>
        </div>

        <div className="payment-methods">
          <h3>Select Payment Method</h3>
          
          <div className="method-tabs">
            <button className={paymentMethod === 'upi' ? 'active' : ''} onClick={() => setPaymentMethod('upi')}>
              📱 UPI
            </button>
            <button className={paymentMethod === 'credit_card' ? 'active' : ''} onClick={() => setPaymentMethod('credit_card')}>
              💳 Credit Card
            </button>
            <button className={paymentMethod === 'debit_card' ? 'active' : ''} onClick={() => setPaymentMethod('debit_card')}>
              💳 Debit Card
            </button>
            <button className={paymentMethod === 'net_banking' ? 'active' : ''} onClick={() => setPaymentMethod('net_banking')}>
              🏦 Net Banking
            </button>
          </div>

          {paymentMethod === 'upi' && (
            <div className="payment-form">
              <input
                type="text"
                placeholder="UPI ID (e.g., name@upi)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
          )}

          {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
            <div className="payment-form">
              <input type="text" placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.slice(0, 16))} />
              <input type="text" placeholder="Cardholder Name" value={cardName} onChange={(e) => setCardName(e.target.value)} />
              <div className="card-row">
                <input type="text" placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} maxLength="5" />
                <input type="text" placeholder="CVV" value={cardCVV} onChange={(e) => setCardCVV(e.target.value)} maxLength="3" />
              </div>
            </div>
          )}

          {paymentMethod === 'net_banking' && (
            <div className="payment-form">
              <select value={bankName} onChange={(e) => setBankName(e.target.value)}>
                <option value="">Select Bank</option>
                <option value="SBI">State Bank of India</option>
                <option value="HDFC">HDFC Bank</option>
                <option value="ICICI">ICICI Bank</option>
                <option value="Axis">Axis Bank</option>
              </select>
            </div>
          )}
        </div>

        <div className="payment-actions">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="pay-btn" onClick={handlePayment} disabled={loading}>
            {loading ? 'Processing...' : `Pay ₹${appointment.fee}`}
          </button>
        </div>
      </div>
    </div>
  );
}
