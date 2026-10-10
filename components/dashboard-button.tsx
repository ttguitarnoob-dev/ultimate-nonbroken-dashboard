import NextLink from "next/link";

interface DashboardButtonProps {
    label: string;
    url: string;
    isExternal: boolean;
}

export default function DashboardButton({ label, url, isExternal }: DashboardButtonProps) {
    return (
        <NextLink
            href={url}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="button button--primary w-full p-10 text-2xl text-accent backdrop-blur-lg bg-black/20 dark:bg-white/10"
        >
            {label}
        </NextLink>
    );
}