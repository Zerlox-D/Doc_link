// import { useEffect } from 'react';
// import './PopUp.css';

// function PopUp({ isOpen, onClose, children, title }) {

//     useEffect(() => {
//         if (isOpen) {
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = '';
//         }
        
//         return () => {
//             document.body.style.overflow = '';
//         };
//     }, [isOpen]);

//     if (!isOpen) return null;

//     const handleBackdropClick = (e) => {
//         if (e.target === e.currentTarget) {
//             onClose();
//         }
//     };

//     return (
//         <div className="modal-backdrop" onClick={handleBackdropClick}>
//             <div className="modal-content">
//                 <div className="modal-header">
//                     {title && <h2 className="modal-title">{title}</h2>}
//                     <button className="modal-close" onClick={onClose}>
//                         ×
//                     </button>
//                 </div>
//                 <div className="modal-body">
//                     {children}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default PopUp;

// Popup.js
import React from 'react';
import './Popup.css';

const Popup = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'max-w-md'
}) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      {/* Backdrop */}
      <div 
        className="popup-backdrop"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className={`popup-content ${maxWidth}`}>
        {/* Header */}
        {title && (
          <div className="popup-header">
            <h2 className="popup-title">{title}</h2>
            <button
              onClick={onClose}
              className="popup-close-button"
            >
              ×
            </button>
          </div>
        )}
        
        {/* Close button when no title */}
        {!title && (
          <button
            onClick={onClose}
            className="popup-close-button-no-title"
          >
            ×
          </button>
        )}
        
        {/* Content */}
        <div className={title ? 'popup-body-with-title' : 'popup-body-no-title'}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popup;