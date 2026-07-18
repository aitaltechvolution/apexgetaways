const CAR_IMAGES = [
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80',
  'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&q=80',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=80',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&q=80',
  'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&q=80',
  'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&q=80',
]

const CARS = [
  { model:'Toyota Corolla',  category:'Economy',   seats:5, bags:2, transmission:'Automatic', fuel:'Petrol',   ac:true,  baseNGN:18000 },
  { model:'Honda CR-V',      category:'SUV',       seats:5, bags:3, transmission:'Automatic', fuel:'Petrol',   ac:true,  baseNGN:32000 },
  { model:'Ford Focus',      category:'Compact',   seats:5, bags:2, transmission:'Manual',    fuel:'Petrol',   ac:true,  baseNGN:22000 },
  { model:'Mercedes C-Class',category:'Premium',   seats:5, bags:2, transmission:'Automatic', fuel:'Diesel',   ac:true,  baseNGN:65000 },
  { model:'Toyota HiAce',    category:'Minivan',   seats:8, bags:6, transmission:'Automatic', fuel:'Diesel',   ac:true,  baseNGN:55000 },
  { model:'Range Rover Sport',category:'Luxury SUV',seats:5,bags:3,transmission:'Automatic', fuel:'Diesel',   ac:true,  baseNGN:120000 },
]

export function generateMockCars({ pickupCity, pickupDate, dropoffDate }) {
  const days = pickupDate && dropoffDate ? Math.max(1, Math.round((new Date(dropoffDate)-new Date(pickupDate))/86400000)) : 3
  return CARS.map((c, i) => ({
    id: `CAR${i+1}`,
    ...c,
    img: CAR_IMAGES[i % CAR_IMAGES.length],
    perDay: c.baseNGN,
    total: c.baseNGN * days,
    days,
    vendor: ['Hertz','Avis','Budget','Enterprise','Sixt','National'][i],
    vendorLogo: `https://logo.clearbit.com/${['hertz','avis','budget','enterprise','sixt','nationalcar'][i]}.com`,
    location: `${pickupCity || 'Lagos'} Airport / City Centre`,
    freeCancellation: i < 4,
    unlimitedMileage: i < 5,
    insuranceIncluded: true,
    features: [c.transmission, `${c.seats} Seats`, `${c.bags} Bags`, c.fuel, c.ac ? 'A/C' : 'No A/C'],
  }))
}
