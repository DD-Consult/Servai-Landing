// Mock data for ServAI landing page

export const mockFormSubmit = async (formData) => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Demo request submitted (MOCK):', formData);
      resolve({ success: true, message: 'Demo request received' });
    }, 500);
  });
};

export const benefits = [
  {
    id: 1,
    metric: '90 seconds',
    title: 'Average order completion time',
    description: 'From QR scan to payment confirmation'
  },
  {
    id: 2,
    metric: '30-50%',
    title: 'Increase in repeat orders',
    description: 'Through built-in loyalty tracking'
  },
  {
    id: 3,
    metric: '100%',
    title: 'Customer data ownership',
    description: 'No aggregator fees or data lock-in'
  },
  {
    id: 4,
    metric: '2B+ users',
    title: 'Global WhatsApp reach',
    description: 'Your customers already use it daily'
  }
];

export const features = [
  {
    id: 1,
    icon: 'MessageSquare',
    title: 'Messaging-First Ordering',
    description: 'Customers order directly through WhatsApp or Messenger - no app downloads, no friction. Just tap, chat, and order in under 90 seconds.'
  },
  {
    id: 2,
    icon: 'Fingerprint',
    title: 'Instant Biometric Payments',
    description: 'Complete transactions with Face ID or Google Pay. No manual card entry, no checkout forms - just fast, secure, trusted payments.'
  },
  {
    id: 3,
    icon: 'Award',
    title: 'Built-In Loyalty System',
    description: 'Track customer orders, reward repeat visits, and build relationships - all inside the chat. Your data, your customers, your loyalty program.'
  },
  {
    id: 4,
    icon: 'BarChart3',
    title: 'Smart Dashboard',
    description: 'Real-time order management with actionable insights. Know your top customers, track preferences, and optimize your menu based on actual data.'
  },
  {
    id: 5,
    icon: 'Languages',
    title: 'Multilingual AI (Coming Soon)',
    description: 'Real-time conversational AI in multiple languages. Perfect for tourist areas - customers order in their native language, translated instantly for staff.'
  },
  {
    id: 6,
    icon: 'Database',
    title: 'Own Your Customer Data',
    description: 'No third-party aggregators taking your customer relationships. Full ownership of profiles, preferences, and contact information.'
  }
];

export const howItWorksSteps = [
  {
    id: 1,
    step: 'Step 1',
    title: 'Tap or Scan',
    description: 'Customer taps NFC tag or scans QR code at your venue'
  },
  {
    id: 2,
    step: 'Step 2',
    title: 'Chat Opens',
    description: 'WhatsApp or Messenger automatically opens - no app install needed'
  },
  {
    id: 3,
    step: 'Step 3',
    title: 'Build Order',
    description: 'AI assistant understands natural language and guides customers through ordering'
  },
  {
    id: 4,
    step: 'Step 4',
    title: 'Biometric Payment',
    description: 'Complete purchase with Face ID, Google Pay, or Apple Pay'
  },
  {
    id: 5,
    step: 'Step 5',
    title: 'Order Received',
    description: 'Your dashboard shows the order instantly with customer profile'
  },
  {
    id: 6,
    step: 'Step 6',
    title: 'Loyalty Updated',
    description: 'Customer earns points automatically - ready for their next visit'
  }
];
