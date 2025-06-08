# Firebase Authentication Integration Guide

This document covers integrating Firebase Authentication into our React application, supporting Phone Number authentication and Google Sign-In (Gmail). We'll outline prerequisites, setup steps, environment variables, Firebase configuration, code snippets, and next steps.

---

## 1. Prerequisites

- Node.js v14+ installed
- A Firebase project (create one at https://console.firebase.google.com)
- Firebase CLI (optional, for advanced tasks)

## 2. Enabling Auth Providers

In the Firebase Console under **Authentication > Sign-in method**, enable:

- **Phone**
- **Google**

Optional: configure authorized domains under **Authentication > Settings**.

## 3. Install Firebase SDK

Run in your project root:
```bash
npm install firebase
```

## 4. Environment Variables

Create a `.env` file in the project root (if using Vite, prefix keys with `VITE_`):

```
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

**Important:** Never commit your `.env` file to source control.

## 5. Initialize Firebase

Create `src/firebase.ts`:
```ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.useDeviceLanguage();
```

## 6. Phone Number Authentication Flow

1. **Render reCAPTCHA verifier** (usually invisible):
   ```ts
   import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
   import { auth } from "@/firebase";

   const verifier = new RecaptchaVerifier(
     "recaptcha-container", {
       size: "invisible",
     },
     auth
   );
   ```

2. **Send OTP**:
   ```ts
   signInWithPhoneNumber(auth, "+1${phone}", verifier)
     .then(confirmationResult => {
       window.confirmationResult = confirmationResult;
       // prompt user for OTP
     })
     .catch(console.error);
   ```

3. **Verify OTP**:
   ```ts
   window.confirmationResult
     .confirm(otp)
     .then(result => {
       const user = result.user;
       // user is signed in
     })
     .catch(console.error);
   ```

Include a `<div id="recaptcha-container" />` in your UI or render it programmatically.

### Create reCAPTCHA Container in HTML
In your component or page:
```html
<div id="recaptcha-container"></div>
```
This div is **required**, even if invisible.

#### Phone Auth Component Example
```tsx
// PhoneAuth.tsx
import React, { useState } from 'react';
import { auth, RecaptchaVerifier } from './firebase';
import { signInWithPhoneNumber } from 'firebase/auth';

const PhoneAuth = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: (response: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
    });
  };

  const sendOtp = async () => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    try {
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      alert('OTP Sent!');
    } catch (error) {
      console.error('Error sending OTP', error);
    }
  };

  const verifyOtp = async () => {
    try {
      await confirmationResult.confirm(otp);
      alert('Phone Auth Successful!');
    } catch (error) {
      console.error('Invalid OTP', error);
    }
  };

  return (
    <div>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+91XXXXXXXXXX"
      />
      <button onClick={sendOtp}>Send OTP</button>

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <button onClick={verifyOtp}>Verify OTP</button>

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneAuth;
```

🔐 Notes:
- The reCAPTCHA will run invisibly in the background.
- Always use a +countrycode format for phone numbers (e.g., +919876543210).
- This solution uses Firebase's invisible reCAPTCHA, which satisfies their security requirements without bothering the user.

## 7. Google Sign-In Flow

1. **Configure provider & popup**:
   ```ts
   import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
   import { auth } from "@/firebase";

   const provider = new GoogleAuthProvider();
   signInWithPopup(auth, provider)
     .then(result => {
       const user = result.user;
       // user is signed in
     })
     .catch(console.error);
   ```

## 8. Managing User State

Create an `AuthContext` to provide `auth.currentUser` and a listener:
```ts
import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase";

interface AuthContextValue { user: User | null }
export const AuthContext = createContext<AuthContextValue>({ user: null });

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
```
Wrap your app in `AuthProvider` in `main.tsx`.

## 9. Next Steps

- Integrate these flows into the `AuthModal` component UI.
- Add loading states, error messages, and form validation.
- Secure routes (e.g., private routes for authenticated users).
- Sign out flow: `auth.signOut()`.

## References

- Firebase JS SDK: https://firebase.google.com/docs/web/setup
- Firebase Authentication: https://firebase.google.com/docs/auth
- Phone Auth: https://firebase.google.com/docs/auth/web/phone-auth
- Google Sign-In: https://firebase.google.com/docs/auth/web/google-signin

---

*This document will evolve as we implement and refine Firebase integration.* 