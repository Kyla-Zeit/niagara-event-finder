import eventFestival from "@/assets/event-festival.jpg";
import eventFood from "@/assets/event-food.jpg";
import eventArt from "@/assets/event-art.jpg";
import eventJazz from "@/assets/event-jazz.jpg";
import eventSports from "@/assets/event-sports.jpg";
import eventComedy from "@/assets/event-comedy.jpg";

export interface NiagaraEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  category: string;
  description: string;
  location: string;
  price: number;
  image: string;
  interested: number;
  lat: number;
  lng: number;
}

export const categories = [
  "All Events",
  "Music",
  "Food & Wine",
  "Arts",
  "Sports",
  "Comedy",
  "Family",
];

export const events: NiagaraEvent[] = [
  {
    id: "1",
    title: "Niagara Music Festival",
    date: "Mar 15 - 16, 2026",
    time: "6pm - 11pm",
    category: "Music",
    description:
      "Experience an unforgettable night of live music at the Niagara Music Festival. Featuring top Canadian artists and international acts performing under the stars near the Falls. Multiple stages, food vendors, and an electric atmosphere await.",
    location: "Queen Victoria Park, Niagara Falls",
    price: 89,
    image: eventFestival,
    interested: 342,
    lat: 43.0896,
    lng: -79.0849,
  },
  {
    id: "2",
    title: "Falls Wine & Dine",
    date: "Mar 22, 2026",
    time: "12pm - 8pm",
    category: "Food & Wine",
    description:
      "Savor the finest wines from Niagara-on-the-Lake wineries paired with gourmet dishes from top regional chefs. Overlooking the stunning Niagara River, this culinary experience combines world-class flavors with breathtaking views.",
    location: "Niagara-on-the-Lake",
    price: 65,
    image: eventFood,
    interested: 218,
    lat: 43.2551,
    lng: -79.0715,
  },
  {
    id: "3",
    title: "Niagara Arts Walk",
    date: "Apr 5 - 6, 2026",
    time: "10am - 5pm",
    category: "Arts",
    description:
      "Discover local and international artists showcasing their work along the scenic Niagara Parkway. Interactive installations, live painting demonstrations, and workshops for all ages make this a must-visit cultural event.",
    location: "Niagara Parkway Trail",
    price: 0,
    image: eventArt,
    interested: 156,
    lat: 43.1070,
    lng: -79.0705,
  },
  {
    id: "4",
    title: "Jazz by the Vineyard",
    date: "Apr 12, 2026",
    time: "7pm - 11pm",
    category: "Music",
    description:
      "An intimate evening of smooth jazz performances set in the heart of Niagara wine country. Enjoy award-winning wines while listening to world-class jazz musicians under the string lights of a historic vineyard estate.",
    location: "Peller Estates Winery",
    price: 120,
    image: eventJazz,
    interested: 89,
    lat: 43.2280,
    lng: -79.0975,
  },
  {
    id: "5",
    title: "Niagara Falls Marathon",
    date: "Apr 19, 2026",
    time: "7am - 1pm",
    category: "Sports",
    description:
      "Run along one of the most scenic marathon routes in the world. The Niagara Falls International Marathon takes you along the Niagara River, past vineyards, and finishing with a stunning view of Horseshoe Falls.",
    location: "Niagara Falls, Start Line",
    price: 45,
    image: eventSports,
    interested: 512,
    lat: 43.0962,
    lng: -79.0377,
  },
  {
    id: "6",
    title: "Comedy Night Live",
    date: "Mar 28, 2026",
    time: "8pm - 10:30pm",
    category: "Comedy",
    description:
      "Get ready to laugh with Canada's funniest comedians at this special comedy showcase. Enjoy a night of stand-up, improv, and sketches in an intimate theatre setting with full bar service.",
    location: "FirstOntario PAC, St. Catharines",
    price: 35,
    image: eventComedy,
    interested: 274,
    lat: 43.1594,
    lng: -79.2469,
  },
];
