import { analyze } from "@/utils/ai";
import { findUserByClerckId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const PATCH = async (request: Request,{params}) => {
    const {content} = await request.json();
    const user = await findUserByClerckId();
    const updatedEntry = await prisma.journalEntry.update({ 
        where: {
            userId_id: {
                userId: user.id,
                id: params.id,
            },
        },
        data: {
            content
        }
    });
    const analysis = await analyze(updatedEntry.content);
    const analysisUpdated = await prisma.analysis.upsert({
        where: {
            entryId: updatedEntry.id,
        },
        create: {
            userId: user.id,
            entryId: updatedEntry.id,
            ...analysis,
        },
        update : {
            ...analysis,
        },
    });
    return NextResponse.json({data:{...updatedEntry,analysis:analysisUpdated}});    
}