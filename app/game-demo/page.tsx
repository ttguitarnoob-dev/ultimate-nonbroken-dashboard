import GameCanvas from "@/components/the-game/components/game-canvas";

export const dynamic = "force-dynamic";


export default async function GamePage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-neutral-950">
      <GameCanvas />
    </main>
  );
}