
import { RecaptchaVerifier } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
    recaptchaWidgetId: string | undefined;
    confirmationResult: any;
    grecaptcha: any;
  }
}

export {};
