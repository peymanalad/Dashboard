function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    randomString += chars.charAt(randomIndex);
  }

  return randomString;
}

export function generateRandomEmail(): string {
  const randomUsername = generateRandomString(10);
  const randomDomain = `${generateRandomString(8)}.com`;

  return `${randomUsername}@${randomDomain}`;
}
