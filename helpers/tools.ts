export function isInSpecificAndroidWebView() {
  const userAgent = navigator.userAgent;

  const isMobileDevice = /iPhone|iPad|iPod|Android|webOS/i.test(userAgent);
  if (!isMobileDevice) return false;

  const isRegularBrowser = /Chrome|Edge|Safari|Opera|Firefox/i.test(userAgent);
  if (isRegularBrowser) return false;

  return true;
}
