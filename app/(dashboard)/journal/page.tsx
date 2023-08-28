import { prisma } from "@/utils/db";
import { analyze } from "@/utils/ai";
import { findUserByClerckId } from "@/utils/auth";
import NewEntryCard from "@/components/NewEntryCard";
import EntryCard from "@/components/EntryCard";
import Question from "@/components/Question";
import Link from "next/link";

const getEntries = async () => {
    const user = await findUserByClerckId() as any;
    const entries = await prisma.journalEntry.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            analysis: true,
        }
    });
    return entries;

}
const JournalPage = async () => {
    const entries = await getEntries();
    return (
        <div className="p-10 bg-zinc-400/10 h-[calc(100vh-60px)]">
        <h2 className="text-3xl mb-8">Journal</h2>
            <div>
                <Question></Question>
            </div>
            <div className="grid grid-cols-3 gap-4 p-10">
                <NewEntryCard/>
                {entries.map((entry) => {
                    return (
                        <Link href={`/journal/${entry.id}`}>
                            <EntryCard entry={entry} key={entry.id}/>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}

export default JournalPage;