export const windowProcess = (key: string) =>
  // Read from process.env first, then fall back to window.env
  process.env?.[key] || (window as any)?.env?.[key];