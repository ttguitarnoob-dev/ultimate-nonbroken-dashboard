export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "KittyCottage",
  description: "All things relevant to the Kitty Cottage.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Carry List",
      href: "/carry-list",
    },
  ],
  navMenuItems: [
    {
      label: "Carry List",
      href: "/carry-list",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
