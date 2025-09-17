
/**
 * Utility function to format seconds into HH:MM:SS string.
 * @param seconds - The number of seconds to format.
 * @returns Formatted time string in HH:MM:SS format.
 */
export const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
