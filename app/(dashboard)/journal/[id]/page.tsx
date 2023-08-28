import Editor from "@/components/Editor";
import { findUserByClerckId } from "@/utils/auth";
import { prisma } from "@/utils/db";

const getEntry = async (id:string) => {
    const user = await findUserByClerckId() as any;
    const entry = await prisma.journalEntry.findUnique({
        where: {
            userId_id:{
                userId: user.id,
                id,
            },
        },
        include: {
            analysis: true,
        }
    });
    return entry;
}
const EntryPage = async ({params}) => {
    const entry = await getEntry(params.id);
    return (
        <div className="w-full h-full overflow-hidden ">
            <Editor entry={entry}/>
        </div>
    );
}
export default EntryPage;