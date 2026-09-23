# Demo Request Form - Current Status & Integration Options

## 🔍 Current Status

**The form is currently using MOCK DATA and NOT saving submissions anywhere.**

### What Happens Now:
1. User fills out the demo request form
2. Clicks "Request Demo" button
3. Form data is logged to browser console only
4. Success message appears
5. Form resets after 5 seconds
6. **❌ Data is NOT saved to any database or sent to any email**

### Current Code Location:
- **Form Handler:** `/app/frontend/src/App.js` (line 46-65)
- **Mock Function:** `/app/frontend/src/mock.js` (line 3-10)

```javascript
// Current mock implementation
export const mockFormSubmit = async (formData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Demo request submitted (MOCK):', formData);
      resolve({ success: true, message: 'Demo request received' });
    }, 500);
  });
};
```

## 📊 Form Data Structure

The form collects:
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  restaurantName: "Test Restaurant",
  location: "New York, USA"
}
```

## 🔧 Integration Options

### Option 1: Email Integration (Fastest - Recommended)

Send form submissions directly to your email.

**Using Web3Forms (Free, No Backend Required):**

```javascript
// Update handleSubmit in App.js
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: 'YOUR_WEB3FORMS_KEY', // Get free at web3forms.com
        subject: 'New ServAI Demo Request',
        from_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        restaurant: formData.restaurantName,
        location: formData.location
      })
    });
    
    if (response.ok) {
      setShowSuccess(true);
      // Reset form...
    }
  } catch (error) {
    console.error('Submission error:', error);
    alert('Failed to submit. Please try again.');
  }
};
```

**Setup:**
1. Go to https://web3forms.com
2. Sign up (free)
3. Get your access key
4. Add to code above
5. Deploy - done!

### Option 2: Google Sheets Integration

Save submissions directly to a Google Sheet.

**Using SheetDB (Free tier available):**

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('https://sheetdb.io/api/v1/YOUR_SHEET_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [{
          Name: formData.name,
          Email: formData.email,
          Phone: formData.phone,
          Restaurant: formData.restaurantName,
          Location: formData.location,
          Timestamp: new Date().toISOString()
        }]
      })
    });
    
    if (response.ok) {
      setShowSuccess(true);
      // Reset form...
    }
  } catch (error) {
    console.error('Submission error:', error);
  }
};
```

**Setup:**
1. Create Google Sheet
2. Go to https://sheetdb.io
3. Connect your sheet
4. Get API endpoint
5. Update code

### Option 3: Backend API Integration

Send to your own backend API endpoint.

```javascript
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/demo-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      setShowSuccess(true);
      // Reset form...
    } else {
      alert('Failed to submit. Please try again.');
    }
  } catch (error) {
    console.error('Submission error:', error);
    alert('Failed to submit. Please try again.');
  }
};
```

**Backend Endpoint Needed:**
```python
# backend/server.py
from pydantic import BaseModel

class DemoRequest(BaseModel):
    name: str
    email: str
    phone: str
    restaurantName: str
    location: str

@api_router.post("/demo-requests")
async def create_demo_request(request: DemoRequest):
    # Save to database
    demo_dict = request.dict()
    demo_dict['created_at'] = datetime.utcnow()
    
    result = await db.demo_requests.insert_one(demo_dict)
    
    # Optional: Send notification email
    # send_email_notification(demo_dict)
    
    return {"success": True, "message": "Demo request received"}
```

### Option 4: CRM Integration

Directly integrate with your CRM (Salesforce, HubSpot, etc.)

**HubSpot Example:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('https://api.hsforms.com/submissions/v3/integration/submit/PORTAL_ID/FORM_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: [
          { name: 'firstname', value: formData.name.split(' ')[0] },
          { name: 'lastname', value: formData.name.split(' ')[1] || '' },
          { name: 'email', value: formData.email },
          { name: 'phone', value: formData.phone },
          { name: 'company', value: formData.restaurantName },
          { name: 'location', value: formData.location }
        ]
      })
    });
    
    if (response.ok) {
      setShowSuccess(true);
    }
  } catch (error) {
    console.error('Submission error:', error);
  }
};
```

### Option 5: Netlify Forms (Easiest for Netlify Hosting)

If deployed on Netlify, use their built-in form handling.

**Update Form HTML:**
```jsx
<form 
  className="demo-form" 
  onSubmit={handleSubmit}
  name="demo-request"
  method="POST"
  data-netlify="true"
>
  <input type="hidden" name="form-name" value="demo-request" />
  {/* Rest of form fields */}
</form>
```

**Update handleSubmit:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  
  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    });
    
    if (response.ok) {
      setShowSuccess(true);
      form.reset();
    }
  } catch (error) {
    console.error('Submission error:', error);
  }
};
```

**View Submissions:**
- Netlify Dashboard → Forms → See all submissions
- Get email notifications
- Export to CSV

## 🎯 Recommendation

**For Quick Setup:** Use **Option 1 (Web3Forms)** or **Option 5 (Netlify Forms)**

**Reasons:**
- No backend code needed
- Free tier available
- Email notifications included
- 5 minutes setup time
- Perfect for landing pages

**For Full Control:** Use **Option 3 (Backend API)**

**Reasons:**
- Complete data ownership
- Custom logic possible
- Integration with existing systems
- Store in your database

## 📝 Implementation Steps (Web3Forms Example)

1. **Get API Key:**
   ```
   Visit: https://web3forms.com
   Sign up (free)
   Copy your access key
   ```

2. **Update App.js:**
   ```javascript
   // Replace mockFormSubmit with actual API call
   import axios from 'axios';
   
   const handleSubmit = async (e) => {
     e.preventDefault();
     
     try {
       const response = await axios.post('https://api.web3forms.com/submit', {
         access_key: 'YOUR_KEY_HERE',
         subject: 'New ServAI Demo Request',
         name: formData.name,
         email: formData.email,
         phone: formData.phone,
         restaurant_name: formData.restaurantName,
         location: formData.location
       });
       
       if (response.status === 200) {
         setShowSuccess(true);
         setTimeout(() => {
           setShowSuccess(false);
           setFormData({
             name: '', email: '', phone: '', 
             restaurantName: '', location: ''
           });
         }, 5000);
       }
     } catch (error) {
       console.error('Error:', error);
       alert('Failed to submit. Please try again.');
     }
   };
   ```

3. **Test:**
   - Fill out form
   - Submit
   - Check your email for notification

4. **Deploy:**
   - Commit and push
   - Forms will work in production

## 🔒 Security Notes

- Never expose API keys in frontend code (use environment variables)
- Add rate limiting to prevent spam
- Validate data on backend
- Use CAPTCHA for public forms (Web3Forms includes this)
- Sanitize user input before storing

## 📧 Email Notification Example

You'll receive emails like:

```
Subject: New ServAI Demo Request

Name: John Doe
Email: john@example.com
Phone: +1234567890
Restaurant Name: Test Restaurant
Location: New York, USA

Submitted: 2025-10-17 11:35:22 UTC
```

## 🐛 Troubleshooting

**Form shows success but no data received:**
- Check API key is correct
- Verify network tab in browser DevTools
- Check email spam folder
- Confirm service (Web3Forms/etc) is active

**CORS errors:**
- Use proper service (Web3Forms handles CORS)
- Backend needs CORS headers
- Check Netlify proxy settings

**Data not saving:**
- Verify database connection
- Check backend logs
- Test API endpoint with Postman

---

**Current Status:** Mock only (data not saved)
**Recommended Action:** Implement Web3Forms or Netlify Forms
**Time to Implement:** 5-10 minutes
