export const DEFAULT_REVIEWS = [
  // --- Ember of the North (ember-north) ---
  {
    id: 'rev-en-1',
    movieId: 'ember-north',
    authorName: 'Aarav Sharma',
    authorEmail: 'aarav.sharma@example.com',
    rating: 9,
    verdict: 'must-watch', // 'must-watch' | 'worth-it' | 'skip'
    headline: 'An unforgiving Himalayan masterclass that demands an IMAX screen!',
    content:
      'The sound design of howling blizzard winds and cracking glacial crevasses alone is worth the ticket price. Vikram Rao gives a career-defining performance as the weathered guide. The tension never lets up from the moment they step above 18,000 feet. Absolutely unmissable in theatres.',
    tags: ['Cinematography', 'Sound Design', 'Acting', 'Edge-of-Seat'],
    hasSpoilers: false,
    likes: 42,
    date: '2026-08-02',
    verifiedBooking: true,
  },
  {
    id: 'rev-en-2',
    movieId: 'ember-north',
    authorName: 'Meghna Roy',
    authorEmail: 'meghna.r@example.com',
    rating: 8,
    verdict: 'must-watch',
    headline: 'Gripping survival thriller with breathtaking visuals',
    content:
      'Unlike usual Bollywood survival dramas, this avoids melodrama and focuses on raw, cold realism. The second act drags slightly in the ice cave sequence, but the climax more than compensates.',
    tags: ['Visuals', 'Direction', 'Realistic'],
    hasSpoilers: false,
    likes: 19,
    date: '2026-08-05',
    verifiedBooking: true,
  },
  {
    id: 'rev-en-3',
    movieId: 'ember-north',
    authorName: 'Rohan Deshmukh',
    authorEmail: 'rohan.d@example.com',
    rating: 6,
    verdict: 'worth-it',
    headline: 'Visually stunning, though the pacing tests your patience',
    content:
      'The landscape cinematography is sublime, but the pacing in the middle hour is quite slow. If you love slow-burn thrillers, you will appreciate it; if you expect non-stop adrenaline, set your expectations accordingly.',
    tags: ['Slow-Burn', 'Cinematography'],
    hasSpoilers: false,
    likes: 8,
    date: '2026-08-09',
    verifiedBooking: false,
  },

  // --- Neon Samurai (neon-samurai) ---
  {
    id: 'rev-ns-1',
    movieId: 'neon-samurai',
    authorName: 'Kabir Varma',
    authorEmail: 'kabir.v@example.com',
    rating: 9,
    verdict: 'must-watch',
    headline: 'Cyberpunk meets chambara in a neon-drenched kinetic rush!',
    content:
      'Blade Runner meets John Wick with katana combat. The sword choreography synchronized to the synthwave electronic score will blow your mind. Priya Nair steals every scene she is in. Watch this in 4DX or Dolby Atmos!',
    tags: ['Action Choreography', 'Synthwave Score', 'Cyberpunk', 'Stylized'],
    hasSpoilers: false,
    likes: 64,
    date: '2026-07-12',
    verifiedBooking: true,
  },
  {
    id: 'rev-ns-2',
    movieId: 'neon-samurai',
    authorName: 'Zoya Merchant',
    authorEmail: 'zoya.m@example.com',
    rating: 7,
    verdict: 'worth-it',
    headline: 'Pure eye candy with an existential identity twist',
    content:
      'The twist regarding his licensed memories was clever, although the third-act villain motivation feels slightly generic. Still, the neon rain aesthetics and sound mixing make it a fantastic weekend popcorn watch.',
    tags: ['Visuals', 'Sci-Fi Plot', 'Great Climax'],
    hasSpoilers: true,
    likes: 27,
    date: '2026-07-18',
    verifiedBooking: true,
  },

]

export const POPULAR_REVIEW_TAGS = [
  'Must Watch in IMAX',
  'Cinematography',
  'Acting',
  'Direction',
  'Screenplay',
  'Music & BGM',
  'Sound Design',
  'Visual Effects',
  'Plot Twist',
  'Family Friendly',
  'Paisa Vasool',
  'Slow Paced',
  'Overhyped',
  'Worth Every Penny',
]
