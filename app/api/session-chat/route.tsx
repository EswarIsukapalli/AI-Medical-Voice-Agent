import { sessionChartTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { v4 as uuidv4 } from 'uuid';
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { desc } from "drizzle-orm";
import { and } from "drizzle-orm";  
export async function POST(req:NextRequest){
    const { notes,selectedDoctor } = await req.json();
    const user = await currentUser();

    try{
        const sessionId = uuidv4();
        const result=await db.insert(sessionChartTable).values({
            sessionId: sessionId,
            createdBy:user?.primaryEmailAddress?.emailAddress,
            notes: notes,
            selectedDoctor: selectedDoctor,
            createdOn: new Date().toISOString()
        }).returning({id: sessionChartTable.id, sessionId: sessionChartTable.sessionId});

        return NextResponse.json(result[0]);
    }catch(e){
        return NextResponse.json(e)
    }
}

export async function GET(req: NextRequest) {
    try {
        const {searchParams }= new URL(req.url);
        const sessionId = searchParams.get('sessionId');
        
        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
        }
        
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if(sessionId==='all'){
            const result = await db.select().from(sessionChartTable);
            return NextResponse.json(result);
        }else{

        }
        
        const result = await db.select().from(sessionChartTable)
        .where(and(
            eq(sessionChartTable.createdBy, user?.primaryEmailAddress?.emailAddress!),
            eq(sessionChartTable.sessionId, sessionId)
        ))
        .orderBy(desc(sessionChartTable.id));
        if (!result[0]) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }
                
        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error fetching session:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}