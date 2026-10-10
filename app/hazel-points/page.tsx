export const dynamic = "force-dynamic";

import { Card } from "@heroui/react";
import { getHazelPointsChangeLogs, GetPoints } from "../lib/server-actions";
import HazelRewardsChooser from "@/components/hazel-points/rewards-chooser";
import { FunConsoleList } from "@/components/fun-list";
import { LogItem } from "@/types";

export default async function HazelPointshPage() {

    const points: number = await GetPoints()
    const messages: LogItem[] = await getHazelPointsChangeLogs();

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-10">
      <section className="flex justify-center">
        <Card.Root className="w-full max-w-sm bg-slate-900 text-white border-green-500 border-2 shadow-lg shadow-amber-500/20">
          <Card.Header className="text-center pb-2">
            <h2 className="text-xl font-semibold tracking-wide text-green-400">House Hazel</h2>
            <p className="text-xs text-slate-400 italic">"Where kindness and critters dwell"</p>
          </Card.Header>
          <Card.Content className="text-center">
            <div className="text-6xl font-bold text-green-400 mb-2">{points}</div>
            <p className="text-sm uppercase tracking-widest text-slate-300">House Points</p>
          </Card.Content>
        </Card.Root>
      </section>
      
      <section>
        <HazelRewardsChooser />
      </section>
      
      <section>
        <FunConsoleList logs={messages} />
      </section>
    </div>
    );
}
