// Encryption key will be derived from a combination of user agent and a constant salt
const ENCRYPTION_SALT = "PGSO_SECURE_STORAGE";

// Get a consistent encryption key for the current browser
async function getEncryptionKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(navigator.userAgent + ENCRYPTION_SALT),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(ENCRYPTION_SALT),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// Encrypt data
export async function encryptData(data: string): Promise<string> {
  const key = await getEncryptionKey();
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encoder.encode(data)
  );

  const encryptedArray = new Uint8Array(encryptedData);
  const combinedArray = new Uint8Array(iv.length + encryptedArray.length);
  combinedArray.set(iv);
  combinedArray.set(encryptedArray, iv.length);

  return btoa(String.fromCharCode(...combinedArray));
}

// Decrypt data
export async function decryptData(encryptedString: string): Promise<string> {
  const key = await getEncryptionKey();
  const decoder = new TextDecoder();
  const data = Uint8Array.from(atob(encryptedString), c => c.charCodeAt(0));
  
  const iv = data.slice(0, 12);
  const encryptedData = data.slice(12);

  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encryptedData
  );

  return decoder.decode(decryptedData);
}

// Secure storage wrapper
export const secureStorage = {
  async set(key: string, value: any) {
    const encrypted = await encryptData(JSON.stringify(value));
    sessionStorage.setItem(key, encrypted);
  },
  async get(key: string) {
    const encrypted = sessionStorage.getItem(key);
    if (!encrypted) return null;
    try {
      return JSON.parse(await decryptData(encrypted));
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      return null;
    }
  },
  async remove(key: string) {
    sessionStorage.removeItem(key);
  }
};

// Session fingerprinting
export async function generateSessionFingerprint(): Promise<string> {
  const fingerprintData = `${navigator.userAgent}${window.screen.height}${window.screen.width}${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprintData);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Rate limiting utilities
export const rateLimit = {
  async checkLimit(key: string, maxAttempts: number, duration: number): Promise<boolean> {
    const attempts = await secureStorage.get(key) || [];
    const now = Date.now();
    const recentAttempts = attempts.filter((time: number) => (now - time) < duration);
    return recentAttempts.length >= maxAttempts;
  },
  async recordAttempt(key: string): Promise<void> {
    const attempts = await secureStorage.get(key) || [];
    attempts.push(Date.now());
    await secureStorage.set(key, attempts);
  },
  async clearAttempts(key: string): Promise<void> {
    await secureStorage.remove(key);
  }
};
