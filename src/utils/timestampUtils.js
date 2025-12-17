/**
 * Safely converts various timestamp formats to milliseconds
 * Handles Firestore Timestamp, JavaScript Date, number, null/undefined
 * @param {*} timestamp - The timestamp to normalize
 * @returns {number} - Timestamp in milliseconds
 */
export function normalizeTimestamp(timestamp) {
  // Handle null/undefined (serverTimestamp not yet resolved)
  if (timestamp === null || timestamp === undefined) {
    return Date.now();
  }
  
  // Handle Firestore Timestamp
  if (timestamp?.toMillis) {
    return timestamp.toMillis();
  }
  
  // Handle Firestore Timestamp with toDate method
  if (timestamp?.toDate) {
    return timestamp.toDate().getTime();
  }
  
  // Handle JavaScript Date object
  if (timestamp instanceof Date) {
    return timestamp.getTime();
  }
  
  // Handle number (already in milliseconds)
  if (typeof timestamp === 'number') {
    return timestamp;
  }
  
  // Fallback for any other type
  console.warn('Unknown timestamp format:', timestamp);
  return Date.now();
}

/**
 * Safely converts timestamp to Date object for display
 * @param {*} timestamp - The timestamp to convert
 * @returns {Date} - Date object
 */
export function toDate(timestamp) {
  // Handle null/undefined
  if (timestamp === null || timestamp === undefined) {
    return new Date();
  }
  
  // Handle Firestore Timestamp with toDate method
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  
  // Handle JavaScript Date object
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  // Handle number (milliseconds)
  if (typeof timestamp === 'number') {
    return new Date(timestamp);
  }
  
  // Fallback
  console.warn('Unknown timestamp format for display:', timestamp);
  return new Date();
}