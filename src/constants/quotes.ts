
export interface Quote {
  id: string;
  text: {
    en: string;
    id: string;
  };
}

export const quotes: Quote[] = [
  {
    id: '1',
    text: {
      en: 'Focus today, succeed tomorrow!',
      id: 'Fokus hari ini, sukses besok!',
    },
  },
  {
    id: '2',
    text: {
      en: 'Every second counts, make it matter.',
      id: 'Setiap detik berharga, jadikan bermakna.',
    },
  },
  {
    id: '3',
    text: {
      en: 'Stay consistent, achieve greatness.',
      id: 'Tetap konsisten, raih kehebatan.',
    },
  },
  {
    id: '4',
    text: {
      en: 'Your time, your power.',
      id: 'Waktumu, kekuatanmu.',
    },
  },
  {
    id: '5',
    text: {
      en: 'Keep going, you\'re almost there!',
      id: 'Teruskan, kamu hampir sampai!',
    },
  },
];

// Fungsi untuk memilih quote acak
export const getRandomQuote = (language: 'en' | 'id'): string => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex].text[language];
};
