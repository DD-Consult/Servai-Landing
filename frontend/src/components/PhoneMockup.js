import React, { useState, useEffect } from 'react';
import { QrCode, MessageCircle, ShoppingBag, Fingerprint, CheckCircle, Award } from 'lucide-react';
import './PhoneMockup.css';

const PhoneMockup = ({ activeStep }) => {
  const [visibleMessages, setVisibleMessages] = useState(0);

  // Reset and animate messages when step 3 is active
  useEffect(() => {
    if (activeStep === 3) {
      setVisibleMessages(0);
      const timeouts = [];
      
      // Show messages one by one with delays
      timeouts.push(setTimeout(() => setVisibleMessages(1), 500));
      timeouts.push(setTimeout(() => setVisibleMessages(2), 1500));
      timeouts.push(setTimeout(() => setVisibleMessages(3), 3000));
      timeouts.push(setTimeout(() => setVisibleMessages(4), 4000));
      timeouts.push(setTimeout(() => setVisibleMessages(5), 5500));
      timeouts.push(setTimeout(() => setVisibleMessages(6), 7000));
      
      return () => timeouts.forEach(timeout => clearTimeout(timeout));
    } else {
      setVisibleMessages(0);
    }
  }, [activeStep]);
  const renderScreenContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="phone-screen-content step-1">
            <div className="qr-scanner-overlay">
              <div className="scanner-line"></div>
            </div>
            <div className="qr-code-container">
              <div className="qr-code">
                <QrCode size={120} strokeWidth={1.5} />
              </div>
              <p className="screen-text">Scan QR Code</p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="phone-screen-content step-2">
            <div className="chat-header">
              <div className="chat-icon-circle">
                <MessageCircle size={24} />
              </div>
              <div>
                <div className="chat-title">ServAI Restaurant</div>
                <div className="chat-status">Online</div>
              </div>
            </div>
            <div className="chat-bubbles">
              <div className="chat-bubble bot-bubble">
                Welcome! Ready to order? 👋
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="phone-screen-content step-3">
            <div className="chat-header">
              <div className="chat-icon-circle">
                <ShoppingBag size={24} />
              </div>
              <div>
                <div className="chat-title">ServAI Restaurant</div>
                <div className="chat-status">AI Assistant</div>
              </div>
            </div>
            <div className="chat-bubbles">
              <div className="chat-bubble bot-bubble">What would you like to order today?</div>
              <div className="chat-bubble user-bubble">I'd like a Margherita pizza please</div>
              <div className="chat-bubble bot-bubble">Great choice! What size would you like?</div>
              <div className="chat-bubble user-bubble">Large, please</div>
              <div className="chat-bubble bot-bubble">Perfect! One large Margherita pizza. Any drinks or sides?</div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="phone-screen-content step-4">
            <div className="payment-screen">
              <div className="payment-icon">
                <Fingerprint size={80} strokeWidth={1.5} />
              </div>
              <h3 className="payment-title">Confirm Payment</h3>
              <div className="payment-amount">$24.99</div>
              <div className="payment-method">
                <div className="method-badge">Apple Pay</div>
                <div className="method-badge">Face ID</div>
              </div>
              <p className="payment-instruction">Touch sensor to confirm</p>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="phone-screen-content step-5">
            <div className="dashboard-screen">
              <div className="dashboard-header">New Order Received</div>
              <div className="order-card">
                <div className="order-notification">
                  <CheckCircle size={40} className="check-icon" />
                </div>
                <div className="order-details">
                  <div className="order-id">Order #1234</div>
                  <div className="order-customer">John Doe</div>
                  <div className="order-items">1x Margherita Pizza</div>
                  <div className="order-total">$24.99</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="phone-screen-content step-6">
            <div className="loyalty-screen">
              <div className="loyalty-icon">
                <Award size={80} strokeWidth={1.5} />
              </div>
              <h3 className="loyalty-title">Points Earned!</h3>
              <div className="points-animation">
                <span className="points-value">+50</span>
              </div>
              <p className="loyalty-message">You've earned 50 loyalty points</p>
              <div className="loyalty-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '75%'}}></div>
                </div>
                <p className="progress-text">150/200 points to next reward</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="phone-mockup-container">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        <div className="phone-screen">
          {renderScreenContent()}
        </div>
        <div className="phone-home-indicator"></div>
      </div>
    </div>
  );
};

export default PhoneMockup;
