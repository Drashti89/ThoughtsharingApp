export function getSecureStorageKey(userId, key) {
  return `secure_${userId}_${key}`;
}

export function encryptData(data) {
  if (!data) return null;
  
  try {
    return btoa(encodeURIComponent(JSON.stringify(data)));
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
}

export function decryptData(encryptedData) {
  if (!encryptedData) return null;
  
  try {
    return JSON.parse(decodeURIComponent(atob(encryptedData)));
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

export function getSecureItem(userId, key) {
  const storageKey = getSecureStorageKey(userId, key);
  const encryptedData = localStorage.getItem(storageKey);
  return decryptData(encryptedData);
}

export function setSecureItem(userId, key, data) {
  const storageKey = getSecureStorageKey(userId, key);
  const encryptedData = encryptData(data);
  if (encryptedData) {
    localStorage.setItem(storageKey, encryptedData);
  }
}