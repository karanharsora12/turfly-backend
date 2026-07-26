import prisma from "../src/utils/prisma";
import "dotenv/config";

const defaultSports = [
  {
    name: "Football",
    description: "The beautiful game",
    icon: "football-outline",
  },
  {
    name: "Basketball",
    description: "Hoops and dunks",
    icon: "basketball-outline",
  },
  {
    name: "Tennis",
    description: "Racket sport played individually or in pairs",
    icon: "tennisball-outline",
  },
  {
    name: "Cricket",
    description: "Bat-and-ball game played between two teams",
    icon: "baseball-outline",
  },
  {
    name: "Volleyball",
    description: "Team sport where a ball is hit over a net",
    icon: "basketball-outline",
  },
  {
    name: "Badminton",
    description: "Racket sport played with a shuttlecock",
    icon: "tennisball-outline",
  },
  {
    name: "Table Tennis",
    description: "Also known as ping-pong",
    icon: "tennisball-outline",
  },
  {
    name: "Golf",
    description: "Club-and-ball sport",
    icon: "golf-outline",
  },
  {
    name: "Baseball",
    description: "Bat-and-ball game played between two opposing teams",
    icon: "baseball-outline",
  },
  {
    name: "Rugby",
    description: "A team game played with an oval ball",
    icon: "american-football-outline",
  },
];

const defaultVenues = [
  {
    name: "Karnavati Club",
    address: "SG Highway, Ahmedabad, Gujarat",
    latitude: 23.0189,
    longitude: 72.502,
    images: [
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000",
    ],
    facilities: ["Parking", "Restrooms", "Water", "Floodlights"],
    rating: 4.8,
  },
  {
    name: "Decathlon Sports Arena",
    address: "Applewoods, SP Ring Road, Ahmedabad, Gujarat",
    latitude: 22.9868,
    longitude: 72.4619,
    images: [
      "https://images.unsplash.com/photo-1518605368461-1ee711659208?q=80&w=1000",
    ],
    facilities: ["Parking", "Equipment Rental", "Cafeteria", "Restrooms"],
    rating: 4.6,
  },
  {
    name: "Surat Tennis Club",
    address: "Athwa Lines, Surat, Gujarat",
    latitude: 21.1818,
    longitude: 72.8021,
    images: [
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1000",
    ],
    facilities: ["Parking", "Restrooms", "Locker Room", "Cafe"],
    rating: 4.5,
  },
  {
    name: "Gotri Sports Complex",
    address: "Gotri, Vadodara, Gujarat",
    latitude: 22.3168,
    longitude: 73.1517,
    images: [
      "https://images.unsplash.com/photo-1627627256672-027a4613d028?q=80&w=1000",
    ],
    facilities: ["Parking", "Restrooms", "Floodlights", "Water"],
    rating: 4.3,
  },
  {
    name: "Rajkot Municipal Stadium",
    address: "Race Course, Rajkot, Gujarat",
    latitude: 22.3023,
    longitude: 70.7937,
    images: [
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1000",
    ],
    facilities: ["Parking", "Restrooms", "Stands", "Floodlights"],
    rating: 4.4,
  },
];

async function main() {
  console.log("Start seeding sports...");
  for (const sport of defaultSports) {
    const createdSport = await prisma.sport.upsert({
      where: { name: sport.name },
      update: {
        icon: sport.icon,
        description: sport.description,
      },
      create: sport,
    });
    console.log(`Seeded sport: ${createdSport.name}`);
  }

  console.log("Start seeding venues...");
  for (const venue of defaultVenues) {
    const createdVenue = await prisma.venue.create({
      data: {
        name: venue.name,
        address: venue.address,
        latitude: venue.latitude,
        longitude: venue.longitude,
        images: venue.images,
        facilities: venue.facilities,
        rating: venue.rating,
      },
    });
    console.log(`Seeded venue: ${createdVenue.name}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
