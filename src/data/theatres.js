export const theatres = [
  {
    id: 'pvr-palladium',
    name: 'PVR Luxe Palladium',
    chain: 'PVR',
    city: 'mumbai',
    locality: 'Lower Parel',
    amenities: ['Dolby Atmos', 'Recliner', 'M-Ticket'],
    screens: ['Luxe', 'IMAX'],
  },
  {
    id: 'inox-rcity',
    name: 'INOX R-City',
    chain: 'INOX',
    city: 'mumbai',
    locality: 'Ghatkopar',
    amenities: ['4K Laser', 'Food Court', 'M-Ticket'],
    screens: ['2D', '3D'],
  },
  {
    id: 'imax-wadala',
    name: 'IMAX Wadala',
    chain: 'IMAX',
    city: 'mumbai',
    locality: 'Wadala',
    amenities: ['IMAX', 'Parking', 'M-Ticket'],
    screens: ['IMAX'],
  },
  {
    id: 'pvr-select-delhi',
    name: 'PVR Select Citywalk',
    chain: 'PVR',
    city: 'delhi',
    locality: 'Saket',
    amenities: ['Dolby Atmos', 'Recliner', 'Valet'],
    screens: ['Luxe', '2D'],
  },
  {
    id: 'cinepolis-dlf',
    name: 'Cinepolis DLF Avenue',
    chain: 'Cinepolis',
    city: 'delhi',
    locality: 'Saket',
    amenities: ['4DX', 'M-Ticket', 'Cafe'],
    screens: ['2D', '3D', '4DX'],
  },
  {
    id: 'pvr-orion',
    name: 'PVR Orion Mall',
    chain: 'PVR',
    city: 'bengaluru',
    locality: 'Rajajinagar',
    amenities: ['IMAX', 'Recliner', 'M-Ticket'],
    screens: ['IMAX', '2D'],
  },
  {
    id: 'inox-mantri',
    name: 'INOX Mantri Square',
    chain: 'INOX',
    city: 'bengaluru',
    locality: 'Malleswaram',
    amenities: ['Dolby 7.1', 'Food Court'],
    screens: ['2D', '3D'],
  },
  {
    id: 'amb-hyderabad',
    name: 'AMB Cinemas Gachibowli',
    chain: 'AMB',
    city: 'hyderabad',
    locality: 'Gachibowli',
    amenities: ['Gold Class', 'IMAX', 'Valet'],
    screens: ['IMAX', 'Gold'],
  },
  {
    id: 'pvr-icon-pune',
    name: 'PVR ICON Pavilion',
    chain: 'PVR',
    city: 'pune',
    locality: 'Shivajinagar',
    amenities: ['Atmos', 'Recliner'],
    screens: ['2D', '3D'],
  },
  {
    id: 'spi-chennai',
    name: 'SPI Palazzo Nexus',
    chain: 'SPI',
    city: 'chennai',
    locality: 'Vadapalani',
    amenities: ['Dolby Atmos', 'M-Ticket'],
    screens: ['2D', 'IMAX'],
  },
]

export function getTheatreById(id) {
  return theatres.find((t) => t.id === id) ?? null
}

export function getTheatresByCity(cityId) {
  return theatres.filter((t) => t.city === cityId)
}
