import { NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function POST(req:NextRequest){
    const user=await currentUser();
    
    try{

        //Check if user already exists
        const users = await db.select().from(usersTable)
        //@ts-ignore
        .where(eq(usersTable.email,user?.primaryEmailAddress?.emailAddress))

        //if not then create new user
        if(users?.length==0){
            const result=await db.insert(usersTable).values({
                name:user?.fullName || '',
                email:user?.primaryEmailAddress?.emailAddress || '',
                credits:10
            }).returning({ id: usersTable.id, name: usersTable.name, email: usersTable.email, credits: usersTable.credits })
            return NextResponse.json(result[0]);
        }
        return NextResponse.json(users[0]);
    }
    catch(e){
        return NextResponse.json(e);
    }
}