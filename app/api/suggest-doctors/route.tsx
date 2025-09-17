import { NextRequest } from "next/server";
import { openai } from "@/config/OpenAiModel"
import { AIDoctorAgents } from "@/shared/list";
import { NextResponse } from "next/server";


export async function POST(req:NextRequest){

    const { notes } = await req.json();


    try{
        const completion = await openai.chat.completions.create({
            model: 'openrouter/sonoma-sky-alpha',
            messages: [
              {
                role: 'system',
                content: JSON.stringify(AIDoctorAgents)
              },
              {
                role: 'user',
                content: "User Notes/Symptoms:"+notes+", Based on the user's symptoms, suggest 2-3 most relevant doctors from the provided list. Return only a JSON array of the selected doctor objects with all their properties (id, specialist, description, image, agentPrompt, voiceId, subscriptionRequired).",
              },
            ],
          });
          const rawResp = completion.choices[0].message.content
          const Resp=rawResp?.trim().replace('```json','').replace('```','')
          const JSONResponse=JSON.parse(Resp || '{}');
          return NextResponse.json(JSONResponse)
    }catch(e){
        NextResponse.json(e);
    }
}