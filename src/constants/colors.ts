export const colors = {
  primary: "#3B82F6", // Biru cerah untuk tombol utama, progress bar
  secondary: "#10B981", // Hijau untuk aksen (misalnya tombol preset)
  backgroundLight: "#FFFFFF", // Putih untuk tema light
  backgroundDark: "#1F2937", // Abu-abu gelap untuk tema dark
  textPrimary: "#111827", // Abu-abu gelap untuk teks utama
  textSecondary: "#6B7280", // Abu-abu terang untuk teks sekunder
  cardLight: "#F9FAFB", // Latar card di tema light
  cardDark: "#374151", // Latar card di tema dark
  accent: "#F59E0B", // Kuning untuk highlight (misalnya streak)
  error: "#EF4444", // Merah untuk error message
  success: "#22C55E", // Hijau untuk notifikasi sukses
} as const;

// Tipe untuk memastikan key colors hanya read-only
export type ColorKey = keyof typeof colors;
