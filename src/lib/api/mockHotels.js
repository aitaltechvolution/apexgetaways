export const HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80',
  'https://images.unsplash.com/photo-1543968996-ee822b8176ba?w=600&q=80',
]

const ROOM_TYPES = ['Standard Room', 'Deluxe Room', 'Superior Room', 'Junior Suite', 'Executive Suite', 'Presidential Suite']
const AMENITIES  = ['Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Room Service', 'Airport Shuttle', 'Concierge', 'Bar', 'Business Centre']

export function generateMockHotels({ city = 'London', checkIn, checkOut, adults = 1, rooms = 1 }) {
  const nights = checkIn && checkOut ? Math.max(1, Math.round((new Date(checkOut)-new Date(checkIn))/86400000)) : 3
  const BASES  = { Dubai:55000, London:85000, Paris:75000, 'New York':110000, Istanbul:40000, Maldives:180000 }
  const basePerNight = BASES[city] || 60000

  return Array.from({ length: 8 }, (_, i) => {
    const stars    = [3, 3, 4, 4, 4, 5, 5, 5][i]
    const multi    = [0.7, 0.8, 1, 1.1, 1.3, 1.8, 2.2, 2.8][i]
    const perNight = Math.round(basePerNight * multi * rooms)
    const total    = perNight * nights
    const names    = [
      `${city} Central Inn`, `Premier Inn ${city}`, `Hilton ${city}`, `Sheraton ${city}`,
      `Radisson Blu ${city}`, `InterContinental ${city}`, `Four Seasons ${city}`, `The Ritz ${city}`,
    ]
    return {
      id: `H${i+1}`,
      name: names[i],
      stars,
      city,
      address: `${10+i*5} ${['King','Queen','Park','High','Royal'][i%5]} Street, ${city}`,
      img: HOTEL_IMAGES[i % HOTEL_IMAGES.length],
      rating: (3.8 + i*0.15 + Math.random()*0.2).toFixed(1),
      reviews: 120 + i*80,
      perNight,
      total,
      nights,
      currency: 'NGN',
      rooms: [
        { type: ROOM_TYPES[Math.min(i, 5)], price: perNight, beds: i < 2 ? '1 Queen' : i < 5 ? '1 King' : '2 Kings', size: 22 + i*8, refundable: i < 6 },
        { type: ROOM_TYPES[Math.min(i+1, 5)], price: Math.round(perNight*1.3), beds: '1 King', size: 30 + i*8, refundable: true },
      ],
      amenities: AMENITIES.slice(0, 4 + Math.min(i, 5)),
      freeCancellation: i < 6,
      breakfastIncluded: i >= 4,
    }
  })
}
