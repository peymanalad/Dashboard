export const convertNumbers2English = (value: any) => {
  const charCodeZero = '۰'.charCodeAt(0);
  return value.replace(/[۰-۹]/g, (w: string) => w.charCodeAt(0) - charCodeZero);
};
