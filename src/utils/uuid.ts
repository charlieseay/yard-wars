/**
 * Simple UUID generator for offline use
 * Using timestamp + random for uniqueness without external dependencies
 */

export function generateUUID(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);

  return `${timestamp}-${randomPart}-${randomPart2}`;
}

export function generateShortId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}
