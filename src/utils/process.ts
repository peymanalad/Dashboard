export const windowProcess = (key: string) => process.env?.[key] || (window as any)?.env?.[key];
