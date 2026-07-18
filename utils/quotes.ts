import { Quote } from "@/types";
import { getLocalDateString } from "./dateHelpers";

const QUOTES: Quote[] = [
  { text: "Atomic habits compound to massive results. Small changes, big differences.", author: "James Clear" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.", author: "Alexander Graham Bell" },
  { text: "It is easy to improve by 1% every day, and those tiny gains compound into massive growth.", author: "James Clear" },
  { text: "Done is better than perfect. Begin before you are ready.", author: "Sheryl Sandberg" },
  { text: "Your habits shape your identity, and your identity shapes your habits.", author: "James Clear" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
  { text: "Simplify your life. Focus on what truly matters, and let go of the noise.", author: "Unknown" },
  { text: "Do something today that your future self will thank you for.", author: "Unknown" },
];

/**
 * Returns a quote that changes daily, based on the current local date.
 */
export const getDailyQuote = (): Quote => {
  const dateStr = getLocalDateString();
  
  // Deterministic hash of the date string
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % QUOTES.length;
  return QUOTES[index];
};
export default getDailyQuote;
