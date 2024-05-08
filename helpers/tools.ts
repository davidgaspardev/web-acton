import { WPP_API_FBCLID, WPP_API_PHONE } from "./env";

export function isInSpecificAndroidWebView() {
  const userAgent = navigator.userAgent;

  const isMobileDevice = /iPhone|iPad|iPod|Android|webOS/i.test(userAgent);
  if (!isMobileDevice) return false;

  const isRegularBrowser = /Chrome|Edge|Safari|Opera|Firefox/i.test(userAgent);
  if (isRegularBrowser) return false;

  return true;
}

/**
 * Builds a WhatsApp link with the given phone number and message.
 * @param phone - The phone number to send the message to.
 * @param message - The message to be sent.
 * @returns The generated WhatsApp link.
 */
export function buildWhatsappLink(message: string) {
  const textEncoded = encodeURIComponent(message);
  return `https://wa.me/${WPP_API_PHONE}?text=${textEncoded}&app_absent=0&fbclid=${WPP_API_FBCLID}`;
}
