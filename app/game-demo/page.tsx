export const dynamic = "force-dynamic";

import GameCanvas from "@/components/game-canvas";
import { inappropriateSearchTerms } from "../lib/helpers";
import { fetchHazelSearch } from "../lib/server-actions";

export default async function GamePage() {
          return (
            <>
            <GameCanvas />
            </>
  );
}
