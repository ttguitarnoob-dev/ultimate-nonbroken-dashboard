export const dynamic = "force-dynamic";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { GetPoints } from "../lib/server-actions";
import HazelRewardsChooser from "@/components/hazel-points/rewards-chooser";

export default async function HazelPointshPage() {

    const points: number = await GetPoints()

    return (
        <>
        <section>

            <Card className="w-[350px] bg-slate-900 text-white border-green-500 border-2 shadow-lg shadow-amber-500/20">
                <CardHeader className="text-center pb-2">
                    <h2 className="text-xl font-semibold tracking-wide text-green-400">House Hazel</h2>
                    <p className="text-xs text-slate-400 italic">"Where kindness and critters dwell"</p>
                </CardHeader>
                <CardBody className="text-center">
                    <div className="text-6xl font-bold text-green-400 mb-2">{points}</div>
                    <p className="text-sm uppercase tracking-widest text-slate-300">House Points</p>
                </CardBody>
            </Card>
        </section>
        <section className="mt-10">
            <HazelRewardsChooser />
        </section>
        </>
    );
}
