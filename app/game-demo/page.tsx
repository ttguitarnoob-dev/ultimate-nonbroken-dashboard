export const dynamic = "force-dynamic";

import GameCanvas from "@/components/game-canvas";

export default async function GamePage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-neutral-950">
      <GameCanvas />
    </main>
  );
}