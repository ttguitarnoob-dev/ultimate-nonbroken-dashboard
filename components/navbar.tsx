import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
  Logo,
  CatIcon,
} from "@/components/icons";

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
    // <HeroUINavbar maxWidth="xl" position="sticky">
    //   <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
    //     <NavbarBrand as="li" className="gap-3 max-w-fit">
    //       <NextLink className="flex justify-start items-center gap-1" href="/">
    //         <CatIcon />
    //         <p className="font-bold text-inherit">Kitty Cottage</p>
    //       </NextLink>
    //     </NavbarBrand>
    //   </NavbarContent>

    //   <NavbarContent
    //     className="hidden sm:flex basis-1/5 sm:basis-full"
    //     justify="end"
    //   >
    //     <NavbarItem className="hidden sm:flex gap-2">
    //       <ThemeSwitch />
    //     </NavbarItem>
    //   </NavbarContent>

    //   <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
    //     <ThemeSwitch />
    //     <NavbarMenuToggle />
    //   </NavbarContent>

    //   <NavbarMenu>
        
    //     <div className="mx-4 mt-2 flex flex-col gap-2">
    //       {siteConfig.navMenuItems.map((item, index) => (
    //         <NavbarMenuItem key={`${item}-${index}`}>
    //           <Link
    //             color="foreground"
    //             href={item.href}
    //             size="lg"
    //           >
    //             {item.label}
    //           </Link>
    //         </NavbarMenuItem>
    //       ))}
    //     </div>
    //   </NavbarMenu>
    // </HeroUINavbar>
  );
};
