import NextLink from "next/link";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { CatIcon } from "@/components/icons";

export const Navbar = () => {
  

  return (
    <nav className="sticky top-0 z-50 w-full max-w-xl mx-auto bg-background">
  <div className="flex items-center justify-between px-4 py-2">
    <div className="flex items-center gap-3">
      <NextLink className="flex items-center gap-1" href="/">
        <CatIcon />
        <p className="font-bold text-inherit">Kitty Cottage</p>
      </NextLink>
    </div>
    
    <div className="hidden sm:flex items-center gap-2">
      <ThemeSwitch />
    </div>

    <div className="sm:hidden flex items-center pl-4">
      <ThemeSwitch />
      {/* Mobile Menu Toggle would go here */}
    </div>
  </div>

  {/* Mobile Menu */}
  <div className="sm:hidden flex flex-col gap-2 px-4 mt-2">
    {siteConfig.navMenuItems.map((item, index) => (
      <NextLink
        key={`${item}-${index}`}
        className="text-foreground text-lg"
        href={item.href}
      >
        {item.label}
      </NextLink>
    ))}
  </div>
</nav>
  );
};
