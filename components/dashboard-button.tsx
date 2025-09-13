import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

interface DashboardButtonProps {
    label: string;
    url: string;
    isExternal: boolean;
}

export default function DashboardButton({ label, url, isExternal }: DashboardButtonProps) {
    return (
        <div>
            {/* <Link
        isExternal={isExternal}
        href={url}
      >
        {label}
      </Link> */}
            <Button
                as={Link}
                href={url}
                isExternal={isExternal}
                className="w-full text-2xl p-10 text-secondary backdrop-blur-lg bg-black/20 dark:bg-white/10"
            >
                {label}
            </Button>
        </div>
    );
}