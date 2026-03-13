export const inappropriateSearchTerms = [
    // Sexual content
    "porn",
    "porno",
    "pornography",
    "xxx",
    "sex",
    "sexy",
    "nude",
    "nudity",
    "naked",
    "boobs",
    "breasts",
    "butt",
    "booty",
    "penis",
    "vagina",
    "genitals",
    "fetish",
    "kinky",
    "bdsm",
    "hardcore",
    "softcore",
    "strip",
    "stripper",
    "stripclub",
    "twerk",
    "onlyfans",
    "camgirl",
    "cams",
    "escort",
    "hookup",
    "dating",
    "nsfw",
    "leaked",
    "explicit",
    "erotic",
    "hentai",
    "rule34",
  
    // Violence & gore
    "gore",
    "bloody",
    "bloodshed",
    "beheading",
    "decapitation",
    "murder",
    "killing",
    "execution",
    "shooting",
    "stabbing",
    "torture",
    "slaughter",
    "massacre",
    "fight",
    "brawl",
    "brutal",
    "graphic",
    "injury",
    "deadbody",
    "corpse",
    "autopsy",
    "war",
    "combat",
    "terrorist",
    "explosion",
  
    // Self-harm
    "suicide",
    "selfharm",
    "cutting",
    "overdose",
    "hang",
    "poison",
    "depression",
    "anorexia",
    "bulimia",
  
    // Drugs & substances
    "drugs",
    "weed",
    "marijuana",
    "cocaine",
    "heroin",
    "meth",
    "lsd",
    "acid",
    "ecstasy",
    "mdma",
    "vape",
    "vaping",
    "smoking",
    "cigarettes",
    "alcohol",
    "vodka",
    "beer",
    "whiskey",
    "drunk",
    "intoxicated",
  
    // Crime & illegal activity
    "shoplift",
    "steal",
    "hacking",
    "hack",
    "fraud",
    "scam",
    "counterfeit",
    "piracy",
    "weapon",
    "gun",
    "knife",
    "bomb",
    "ammo",
    "arson",
    "kidnap",
  
    // Hate & extremism
    "racist",
    "nazi",
    "kkk",
    "extremist",
    "supremacy",
    "terrorism",
  
    // Gambling
    "gambling",
    "casino",
    "betting",
    "lottery",
    "slots",
    "blackjack",
    "roulette",
    "poker"
  ];

  // Find location with gps coordinates
  export async function getNearestPlace(
    latitude: string,
    longitude: string
  ): Promise<string | null> {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            "User-Agent": "my-app/1.0"
          }
        }
      );
  
      const data = await res.json();
  
      const name =
        data.name ||
        data.address?.amenity ||
        data.address?.building ||
        data.address?.road;
  
      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        "";
  
      const state = data.address?.state || "";
  
      if (!name) return null;
  
      return `${name} - ${city}, ${state}`;
    } catch (err) {
      console.error(err);
      return null;
    }
  }