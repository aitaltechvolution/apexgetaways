import {
  Plane,
  FileCheck,
  GraduationCap,
  FileText,
  Globe,
  Hotel,
  Car,
  Palmtree,
  Ship,
  ShieldCheck,
  Briefcase,
  Coins,
} from 'lucide-react';





// ─── BRAND ───────────────────────────────────────────────────────────────────
export const BRAND = {
  name:      'Apex Getaways & Travel LTD',
  shortName: 'Apex Getaways',
  tagline:   'Opening Doors to New Destinations.',
  mission:   'Empowering individuals and families to explore the world through trusted travel, visa, and immigration services delivered with excellence.',
  vision:    'To be Africa\'s preferred travel and immigration partner, inspiring confidence and creating life-changing travel experiences worldwide.',
  phone:     '+2348062841276',
  whatsapp:  '+2348062841276',
  email:     'apexgetaways.travel@gmail.com',
  address:   'Abuja, Nigeria',
  hours:     '24/7',
  instagram: 'https://www.instagram.com/apex_getaways_travel_ltd?igsh=MTd1Y3o0OGxqZGl4aA==',
  tiktok:    'https://www.tiktok.com/@visa_travel_support?_r=1&_t=ZS-97s38omonhg',
  facebook:  '#',
  founded:   '2026',
  ceo:       { name:'Joy Nathaniel', title:'Founder & CEO', bio:'Mrs. Joy Nathaniel is the Founder and CEO of Apex Getaways Travel LTD. She is passionate about helping individuals, families, students, and businesses access reliable travel and immigration solutions. Through integrity, professionalism, and exceptional customer service, she has built a company committed to making international travel simple, seamless, and stress-free.' },
}

// ─── SERVICES ────────────────────────────────────────────────────────────────
export const SERVICES = [
  {
    id: 'flights',
    icon: Plane,
    title: 'Flight Reservation & Ticketing',
    desc: 'Domestic and international flights — one-way, round-trip, multi-city, and group bookings with expert fare guidance.',
    color: 'from-blue-900 to-blue-700',
  },
  {
    id: 'visa',
    icon: FileCheck,
    title: 'Visa Assistance',
    desc: 'Tourist, business, student, visitor, and family visit visas. Documentation review, appointment scheduling, and guidance.',
    color: 'from-navy to-navy-light',
  },
  {
    id: 'study-abroad',
    icon: GraduationCap,
    title: 'Study Abroad Services',
    desc: 'International school admissions, program selection, study permit guidance, and pre-departure orientation support.',
    color: 'from-emerald-900 to-emerald-700',
  },
  {
    id: 'ielts',
    icon: FileText,
    title: 'IELTS & English Proficiency',
    desc: 'IELTS registration guidance, test preparation referrals, and advice on language requirements for study and immigration.',
    color: 'from-purple-900 to-purple-700',
  },
  {
    id: 'immigration',
    icon: Globe,
    title: 'Immigration Consultation',
    desc: 'General immigration information, guidance on pathways, documentation support, and settlement preparation.',
    color: 'from-teal-900 to-teal-700',
  },
  {
    id: 'hotels',
    icon: Hotel,
    title: 'Hotel & Accommodation Booking',
    desc: 'Hotel reservations, serviced apartments, vacation accommodation, and short-term or long-term lodging arrangements.',
    color: 'from-amber-900 to-amber-700',
  },
  {
    id: 'airport',
    icon: Car,
    title: 'Airport Services',
    desc: 'Airport pick-up, drop-off, meet-and-greet, and transfer coordination — prompt, professional, reliable.',
    color: 'from-rose-900 to-rose-700',
  },
  {
    id: 'holiday',
    icon: Palmtree,
    title: 'Holiday & Tour Packages',
    desc: 'Family vacations, honeymoon packages, group tours, adventure travel, religious and pilgrimage tours.',
    color: 'from-cyan-900 to-cyan-700',
  },
  {
    id: 'cruise',
    icon: Ship,
    title: 'Cruise Bookings',
    desc: 'International cruise reservations, vacation cruise packages, family and luxury cruises.',
    color: 'from-indigo-900 to-indigo-700',
  },
  {
    id: 'insurance',
    icon: ShieldCheck,
    title: 'Travel Insurance Assistance',
    desc: 'Guidance on obtaining travel insurance and information on coverage options required for international travel.',
    color: 'from-green-900 to-green-700',
  },
  {
    id: 'corporate',
    icon: Briefcase,
    title: 'Group & Corporate Travel',
    desc: 'Corporate travel planning, business travel coordination, conference travel, educational and church group travel.',
    color: 'from-slate-900 to-slate-700',
  },
  {
    id: 'forex',
    icon: Coins,
    title: 'Foreign Exchange Guidance',
    desc: 'Information on travel-related foreign exchange procedures and currency planning guidance.',
    color: 'from-yellow-900 to-yellow-700',
  },
];
// ─── PACKAGES ────────────────────────────────────────────────────────────────
export const PACKAGES = [
  {
    id: 1, tag:'Best Seller',
    title:'Dubai Explorer Package',
    dest:'Dubai, United Arab Emirates', flag:'🇦🇪', nights:5, days:5,
    price:2162500, oldPrice:2700000,   // ~$1350 @ 1600 NGN/USD
    img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    imgs:[
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632599-e390a412a4b5?w=800&q=80',
    ],
    includes:['Return economy flight','4-night hotel accommodation','Daily breakfast','Airport pick-up & drop-off','Dubai city tour','Desert safari experience','Visa assistance','Travel itinerary','24/7 travel support'],
    description:'Experience the glittering skyline of Dubai — from the iconic Burj Khalifa and Palm Jumeirah to thrilling desert safaris and world-class shopping. Our Dubai Explorer Package handles everything so you can simply enjoy the experience.',
    highlights:['Burj Khalifa','Palm Jumeirah','Desert Safari','Dubai Mall','Dubai Marina','Museum of the Future'],
  },
  {
    id: 2, tag:'Popular',
    title:'Canada Experience Package',
    dest:'Toronto, Niagara Falls & Ottawa', flag:'🇨🇦', nights:7, days:7,
    price:4560000, oldPrice:5600000,
    img:'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&q=80',
    imgs:[
      'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&q=80',
      'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?w=800&q=80',
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
    ],
    includes:['Return flight','Hotel accommodation','Daily breakfast','Airport transfers','Guided city tours','Niagara Falls excursion','Visa guidance','Travel insurance assistance','Professional consultation'],
    description:'Discover Canada\'s extraordinary blend of natural beauty, multicultural cities, and world-class attractions. From the thundering Niagara Falls to the cosmopolitan streets of Toronto and the political elegance of Ottawa.',
    highlights:['Niagara Falls','CN Tower','Parliament Hill','Old Quebec','Banff National Park','Stanley Park'],
  },
  {
    id: 3, tag:'Romantic',
    title:'Paris & France Holiday',
    dest:'Paris, France', flag:'🇫🇷', nights:6, days:6,
    price:3680000, oldPrice:4480000,
    img:'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
    imgs:[
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
      'https://images.unsplash.com/photo-1545044846-351ba102b6d5?w=800&q=80',
      'https://images.unsplash.com/photo-1478135467691-2099a99ee85c?w=800&q=80',
    ],
    includes:['Return flight','Hotel accommodation','Daily breakfast','Airport transfers','Guided city tour','Seine River cruise','Visa assistance'],
    description:'Paris — the City of Light and Love — awaits you. Stroll beneath the Eiffel Tower, marvel at the Louvre, cruise the Seine at dusk, and savour world-famous French cuisine in an atmosphere of unparalleled elegance.',
    highlights:['Eiffel Tower','Louvre Museum','Versailles','Notre-Dame','Seine River Cruise','Champs-Élysées'],
  },
  {
    id: 4, tag:'Cultural',
    title:'UK Discovery Package',
    dest:'London, England', flag:'🇬🇧', nights:6, days:6,
    price:3840000, oldPrice:4800000,
    img:'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&q=80',
    imgs:[
      'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&q=80',
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
      'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&q=80',
    ],
    includes:['Return flight','Hotel accommodation','Daily breakfast','Airport transfers','Guided city tour','Visa guidance','Travel consultation'],
    description:'London — a city where ancient history meets cutting-edge culture. Walk past Buckingham Palace, ride the London Eye, explore centuries-old castles, and discover why the UK remains one of the world\'s most visited destinations.',
    highlights:['Big Ben','Buckingham Palace','London Eye','Tower Bridge','Stonehenge','Westminster Abbey'],
  },
  {
    id: 5, tag:'Adventure',
    title:'Turkey Vacation Package',
    dest:'Istanbul & Cappadocia, Türkiye', flag:'🇹🇷', nights:7, days:7,
    price:3120000, oldPrice:3840000,
    img:'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
    imgs:[
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
      'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?w=800&q=80',
      'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&q=80',
    ],
    includes:['Return flight','Hotel accommodation','Daily breakfast','Airport transfers','Guided sightseeing tours','Visa assistance','Professional support'],
    description:'Turkey is a land of extraordinary contrasts — Byzantine mosaics, Ottoman palaces, fairy-chimney landscapes in Cappadocia, and a sunrise hot air balloon ride over the valleys that will stay with you forever.',
    highlights:['Blue Mosque','Hagia Sophia','Cappadocia Balloons','Grand Bazaar','Bosphorus Cruise','Pamukkale'],
  },
  {
    id: 6, tag:'Luxury',
    title:'Maldives Luxury Escape',
    dest:'Maldives', flag:'🇲🇻', nights:5, days:5,
    price:4320000, oldPrice:5400000,
    img:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    imgs:[
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80',
      'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&q=80',
    ],
    includes:['Return flight','Luxury resort accommodation','Breakfast and dinner','Airport speedboat transfer','Island excursions','Honeymoon arrangements (optional)'],
    description:'The Maldives — where the ocean meets the sky and time slows to a gentle drift. Slip into a pristine overwater villa, snorkel through coral gardens, and watch the most breathtaking sunsets on earth.',
    highlights:['Overwater Bungalows','Crystal Lagoons','Coral Snorkelling','Sunset Dhoni Cruise','White Sand Beaches','Marine Life'],
  },
]

// ─── DESTINATIONS ────────────────────────────────────────────────────────────
export const DESTINATIONS = [
  { id:1, name:'Dubai',        country:'United Arab Emirates', flag:'🇦🇪', img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=700&q=80', tag:'Luxury',    rating:4.9, from:'From $1,350', attractions:['Burj Khalifa','Palm Jumeirah','Desert Safari','Dubai Mall'] },
  { id:2, name:'Canada',       country:'Canada',               flag:'🇨🇦', img:'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=700&q=80', tag:'Education', rating:4.8, from:'From $2,850', attractions:['Niagara Falls','CN Tower','Banff','Parliament Hill'] },
  { id:3, name:'United Kingdom',country:'United Kingdom',       flag:'🇬🇧', img:'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=700&q=80', tag:'Culture',   rating:4.8, from:'From $2,400', attractions:['Big Ben','Buckingham Palace','Stonehenge','London Eye'] },
  { id:4, name:'France',       country:'France',               flag:'🇫🇷', img:'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=700&q=80', tag:'Romance',   rating:4.9, from:'From $2,300', attractions:['Eiffel Tower','Louvre','Versailles','Seine Cruise'] },
  { id:5, name:'Türkiye',      country:'Türkiye',              flag:'🇹🇷', img:'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=700&q=80', tag:'Historic',  rating:4.8, from:'From $1,950', attractions:['Blue Mosque','Cappadocia','Hagia Sophia','Bosphorus'] },
  { id:6, name:'Maldives',     country:'Maldives',             flag:'🇲🇻', img:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=700&q=80', tag:'Luxury',    rating:5.0, from:'From $2,700', attractions:['Overwater Villas','Coral Reefs','White Beaches','Lagoons'] },
  { id:7, name:'Kenya',        country:'Kenya',                flag:'🇰🇪', img:'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=700&q=80', tag:'Safari',    rating:4.7, from:'From $1,800', attractions:['Maasai Mara','Amboseli','Diani Beach','Nairobi Park'] },
  { id:8, name:'South Africa', country:'South Africa',         flag:'🇿🇦', img:'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=700&q=80', tag:'Adventure', rating:4.7, from:'From $2,100', attractions:['Table Mountain','Kruger Park','Cape Point','Robben Island'] },
  { id:9, name:'Rwanda',       country:'Rwanda',               flag:'🇷🇼', img:'https://cdn1.matadornetwork.com/blogs/1/2019/06/Kigali-Rwanda-1200x854.jpg', tag:'Eco',       rating:4.8, from:'From $1,600', attractions:['Gorilla Trekking','Lake Kivu','Nyungwe Forest','Kigali'] },
  { id:10,name:'Singapore',    country:'Singapore',            flag:'🇸🇬', img:'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=700&q=80', tag:'Modern',   rating:4.8, from:'From $2,200', attractions:['Gardens by the Bay','Marina Bay Sands','Sentosa','Chinatown'] },
]

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  { name:'Chiamaka Okafor',   role:'Lagos',          dest:'Dubai',   stars:5, text:'Apex Getaways handled every single detail of our Dubai trip — visa, flights, hotel, transfers. We just showed up and enjoyed ourselves. Absolutely world-class service.' },
  { name:'Emeka Chukwuemeka', role:'Abuja',          dest:'UK',      stars:5, text:'I was struggling with my UK visa application for months. Within 2 weeks of contacting Apex, I had my visa. Their documentation guidance is unmatched in Nigeria.' },
  { name:'Funke Adeyemi',     role:'Port Harcourt',  dest:'Turkey',  stars:5, text:'The Turkey package was breathtaking — Cappadocia hot air balloon, Blue Mosque, everything. Mrs. Joy\'s team took care of us like family. Highly recommended!' },
  { name:'Dr. Musa Aliyu',    role:'Kano',           dest:'Canada',  stars:5, text:'Sent my daughter to study in Canada through Apex. From school selection to study permit, they guided us every step. She\'s now settled and thriving. God bless this team.' },
  { name:'Bisi Adebola',      role:'Ibadan',         dest:'Maldives',stars:5, text:'Our honeymoon in the Maldives was absolute paradise. The overwater villa, the crystal water — I still can\'t believe it was real. Apex made our dream a reality.' },
  { name:'Hajiya Ramatu Sule',role:'Abuja',          dest:'Saudi Arabia', stars:5, text:'Apex organised our entire Umrah pilgrimage. The arrangements were seamless, the group was well-managed, and we focused entirely on worship. Truly a blessed experience.' },
]

// ─── AIRPORTS ────────────────────────────────────────────────────────────────
export const AIRPORTS = [
  { code:'ABV', name:'Nnamdi Azikiwe International', city:'Abuja', country:'Nigeria' },
  { code:'LOS', name:'Murtala Muhammed International', city:'Lagos', country:'Nigeria' },
  { code:'PHC', name:'Port Harcourt International', city:'Port Harcourt', country:'Nigeria' },
  { code:'KAN', name:'Mallam Aminu Kano International', city:'Kano', country:'Nigeria' },
  { code:'DXB', name:'Dubai International Airport', city:'Dubai', country:'UAE' },
  { code:'LHR', name:'Heathrow Airport', city:'London', country:'United Kingdom' },
  { code:'CDG', name:'Charles de Gaulle Airport', city:'Paris', country:'France' },
  { code:'JFK', name:'John F. Kennedy International', city:'New York', country:'USA' },
  { code:'IST', name:'Istanbul Airport', city:'Istanbul', country:'Türkiye' },
  { code:'MLE', name:'Velana International Airport', city:'Malé', country:'Maldives' },
  { code:'ACC', name:'Kotoka International Airport', city:'Accra', country:'Ghana' },
  { code:'NBO', name:'Jomo Kenyatta International', city:'Nairobi', country:'Kenya' },
  { code:'JNB', name:'O.R. Tambo International', city:'Johannesburg', country:'South Africa' },
  { code:'CAI', name:'Cairo International Airport', city:'Cairo', country:'Egypt' },
  { code:'ADD', name:'Addis Ababa Bole International', city:'Addis Ababa', country:'Ethiopia' },
  { code:'AMS', name:'Amsterdam Airport Schiphol', city:'Amsterdam', country:'Netherlands' },
  { code:'FRA', name:'Frankfurt Airport', city:'Frankfurt', country:'Germany' },
  { code:'DOH', name:'Hamad International Airport', city:'Doha', country:'Qatar' },
  { code:'SIN', name:'Changi Airport', city:'Singapore', country:'Singapore' },
  { code:'YYZ', name:'Toronto Pearson International', city:'Toronto', country:'Canada' },
  { code:'ORD', name:"O'Hare International Airport", city:'Chicago', country:'USA' },
  { code:'DUB', name:'Dublin Airport', city:'Dublin', country:'Ireland' },
  { code:'RWF', name:'Kigali International Airport', city:'Kigali', country:'Rwanda' },
  { code:'CPT', name:'Cape Town International', city:'Cape Town', country:'South Africa' },
  { code:'KWI', name:'Kuwait International Airport', city:'Kuwait City', country:'Kuwait' },
  { code:'RUH', name:'King Khalid International', city:'Riyadh', country:'Saudi Arabia' },
  { code:'KUL', name:'Kuala Lumpur International', city:'Kuala Lumpur', country:'Malaysia' },
  { code:'BKK', name:'Suvarnabhumi Airport', city:'Bangkok', country:'Thailand' },
  { code:'NRT', name:'Narita International Airport', city:'Tokyo', country:'Japan' },
  { code:'MRU', name:'Sir Seewoosagur Ramgoolam International', city:'Port Louis', country:'Mauritius' },
]

export const AIRLINES = [
  { code:'ET', name:'Ethiopian Airlines',  logo:'🇪🇹' },
  { code:'EK', name:'Emirates',            logo:'🇦🇪' },
  { code:'QR', name:'Qatar Airways',       logo:'🇶🇦' },
  { code:'BA', name:'British Airways',     logo:'🇬🇧' },
  { code:'TK', name:'Turkish Airlines',    logo:'🇹🇷' },
  { code:'AF', name:'Air France',          logo:'🇫🇷' },
  { code:'KL', name:'KLM',                logo:'🇳🇱' },
  { code:'W3', name:'Arik Air',           logo:'🇳🇬' },
  { code:'MS', name:'Egyptair',           logo:'🇪🇬' },
  { code:'SA', name:'South African Airways',logo:'🇿🇦' },
]

export function generateFlights(from, to, date) {
  const base = Math.floor(Math.random()*600000)+300000
  return AIRLINES.slice(0,6).map((airline,i) => {
    const depH = 5+i*3, dur=90+Math.floor(Math.random()*480)
    const arrH = depH+Math.floor(dur/60), stops=i<2?0:i<4?1:2
    return {
      id:`${airline.code}-${from}-${to}-${i}`,
      airline:airline.name, airlineCode:airline.code, logo:airline.logo,
      flightNo:`${airline.code}${400+i*17}`,
      from, to, date,
      dep:`${String(depH).padStart(2,'0')}:${i%2===0?'00':'30'}`,
      arr:`${String(arrH%24).padStart(2,'0')}:${i%2===0?'45':'15'}`,
      duration:`${Math.floor(dur/60)}h ${dur%60}m`, durationMins:dur,
      stops, stopCity:stops===1?['ACC','ADD','CAI','DXB'][i%4]:null,
      economy:Math.round(base*(0.8+i*0.07)),
      business:Math.round(base*(0.8+i*0.07)*3.2),
      first:Math.round(base*(0.8+i*0.07)*6),
      premium_economy:Math.round(base*(0.8+i*0.07)*1.6),
      seatsLeft:Math.floor(Math.random()*8)+1,
      baggage:stops===0?'23kg included':'20kg included',
      refundable:i%3===0,
    }
  }).sort((a,b)=>a.economy-b.economy)
}

export function generateHotels(city, checkIn, checkOut) {
  const nights=checkIn&&checkOut?Math.max(1,Math.round((new Date(checkOut)-new Date(checkIn))/86400000)):1
  const CHAINS=['Hilton','Marriott','Radisson','Four Seasons','Sheraton','Hyatt','InterContinental','Novotel','Ibis','Pullman']
  const IMGS=[
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&q=80',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=700&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=700&q=80',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=700&q=80',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=700&q=80',
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=700&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=700&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=700&q=80',
  ]
  return Array.from({length:8},(_,i)=>{
    const chain=CHAINS[i%CHAINS.length], stars=[3,3,4,4,4,5,5,5][i]
    const perNight=Math.round((stars*25000+Math.random()*50000)*(1+i*0.1))
    return {
      id:`hotel-${city}-${i}`, name:`${chain} ${city}${i>4?' Suites':''}`,
      chain, city, stars, rating:(3.5+(i%5)*0.3).toFixed(1),
      reviews:80+i*47, img:IMGS[i%IMGS.length],
      address:`${10+i*3} ${['Marina','Victoria Island','CBD','Airport Rd','GRA'][i%5]}, ${city}`,
      perNight, nights, total:perNight*nights,
      amenities:['Free WiFi','Swimming Pool','Gym','Restaurant','Airport Shuttle','Spa','Bar','Room Service'].slice(0,4+(i%5)),
      roomTypes:[
        {type:'Standard Room',price:perNight,beds:'1 Queen Bed'},
        {type:'Deluxe Room',price:Math.round(perNight*1.3),beds:'1 King Bed'},
        {type:'Suite',price:Math.round(perNight*2.1),beds:'2 Beds + Living Area'},
      ],
      freeCancellation:i%2===0, breakfastIncluded:i%3===0,
    }
  })
}

export const PICKUP_VEHICLES = [
  {
    id: 'sedan',
    name: 'Sedan',
    desc: 'Toyota Camry or similar',
    seats: 4,
    luggage: 2,
    img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800',
    basePrice: 12000,
    pricePerKm: 350,
    ac: true,
  },
  {
    id: 'suv',
    name: 'SUV',
    desc: 'Toyota Prado or similar',
    seats: 6,
    luggage: 4,
    img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    basePrice: 18000,
    pricePerKm: 500,
    ac: true,
  },
  {
    id: 'minivan',
    name: 'Minivan',
    desc: 'Toyota Hiace or similar',
    seats: 14,
    luggage: 8,
    img: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800',
    basePrice: 25000,
    pricePerKm: 650,
    ac: true,
  },
  {
    id: 'luxury',
    name: 'Luxury / Executive',
    desc: 'Mercedes E-Class or similar',
    seats: 4,
    luggage: 2,
    img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
    basePrice: 35000,
    pricePerKm: 900,
    ac: true,
  },
  {
    id: 'coaster',
    name: 'Coaster Bus',
    desc: 'Toyota Coaster or similar',
    seats: 30,
    luggage: 10,
    img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
    basePrice: 45000,
    pricePerKm: 800,
    ac: true,
  },
];

export const PICKUP_LOCATIONS=[
  'Nnamdi Azikiwe Airport (ABV) — Abuja',
  'Murtala Muhammed Airport (LOS) — Lagos',
  'Port Harcourt Airport (PHC)',
  'Kano Airport (KAN)',
  'Central Business District, Abuja',
  'Wuse 2, Abuja',
  'Garki, Abuja',
  'Victoria Island, Lagos',
  'Lekki Phase 1, Lagos',
  'Ikeja, Lagos',
  'GRA, Port Harcourt',
  'Custom Location (specify in notes)',
]

export const CORE_VALUES=[
  {letter:'A',word:'Accountability', desc:'We take responsibility for every service we provide.'},
  {letter:'P',word:'Professionalism', desc:'We deliver expert guidance with integrity and respect.'},
  {letter:'E',word:'Excellence',     desc:'We strive for exceptional quality in every client experience.'},
  {letter:'X',word:'eXperience',     desc:'We create smooth, memorable, and stress-free travel journeys.'},
]

export const formatNGN=(n)=>new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(n)
export const formatUSD=(n)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n)
