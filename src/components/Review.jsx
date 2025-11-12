import { useState } from 'react';

export default function SubmitReview({ appointmentId, doctorId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    const patientId = localStorage.getItem('patient_id');
    
    setSubmitting(true);
    
    fetch('http://localhost/Doc_Link/php/SubmitReview.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appointment_id: appointmentId,
        patient_id: parseInt(patientId),
        doctor_id: doctorId,
        rating: rating,
        review_text: reviewText
      })
    })
      .then(res => res.json())
      .then(data => {
        setSubmitting(false);
        if (data.success) {
          alert('Review submitted successfully!');
          onSuccess();
        } else {
          alert(data.error || 'Failed to submit review');
        }
      })
      .catch(err => {
        setSubmitting(false);
        console.error(err);
        alert('Error submitting review');
      });
  };

  return (
    <div className="review-form">
      <h3>Rate Your Experience</h3>
      
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            ★
          </span>
        ))}
      </div>
      
      <textarea
        placeholder="Share your experience (optional)"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        rows="4"
        maxLength="500"
      />
      
      <button onClick={handleSubmit} disabled={submitting || rating === 0}>
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );
}
