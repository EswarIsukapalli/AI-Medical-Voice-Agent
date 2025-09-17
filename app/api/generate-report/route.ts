import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { sessionChartTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { openai } from "@/config/OpenAiModel";

type GenerateBody = {
  sessionId: string;
  notes?: string;
  messages: { role: string; text: string }[];
  doctorSpecialist?: string;
  userEmail?: string;
  agentName?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateBody;
    const { sessionId, notes, messages, doctorSpecialist, userEmail, agentName } = body;
    if (!sessionId || !messages || messages.length === 0) {
      return NextResponse.json({ error: "sessionId and messages are required" }, { status: 400 });
    }

    const conversationText = messages
      .map((m) => `${m.role}: ${m.text}`)
      .join("\n");

    const prompt = `You are an advanced medical AI scribe analyzing a voice conversation between a patient and an AI medical assistant. 
Produce a comprehensive JSON report that captures all medical insights, conversation flow, and clinical findings.

Return ONLY valid JSON with these keys:
- user: Patient name or identifier
- agent: AI assistant name/specialization
- chiefComplaint: Primary reason for consultation
- summary: Detailed conversation summary with medical context
- symptoms: Array of all symptoms mentioned
- duration: How long symptoms have been present
- severity: Severity level (mild/moderate/severe/critical)
- conversationFlow: Array of key conversation points with timestamps
- medicalHistory: Any relevant medical history mentioned
- vitalSigns: Any vital signs discussed
- recommendations: AI assistant's recommendations
- followUp: Suggested follow-up actions
- urgency: Urgency level (routine/urgent/emergency)
- diagnosis: Preliminary diagnosis or assessment
- medications: Any medications discussed
- nextSteps: Recommended next steps for patient

Be thorough and faithful to the transcript. Extract all medical information, conversation dynamics, and clinical insights.

Context:
- Notes: ${notes ?? ""}
- Doctor Specialist: ${doctorSpecialist ?? ""}
- User Email: ${userEmail ?? "Anonymous"}
- Agent: ${agentName ?? (doctorSpecialist ? doctorSpecialist + " AI" : "AI Assistant")}

Transcript:\n${conversationText}`;

    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert medical AI scribe specializing in comprehensive medical conversation analysis. You extract detailed clinical information, conversation dynamics, and medical insights from patient-AI assistant interactions. Always provide thorough, accurate, and clinically relevant summaries." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    } as any);

    const content = response.choices?.[0]?.message?.content ?? "{}";
    let report: any = {};
    try {
      report = JSON.parse(content);
    } catch {
      report = {};
    }

    await db
      .update(sessionChartTable)
      .set({ report })
      .where(eq(sessionChartTable.sessionId, sessionId));

    return NextResponse.json({ ok: true, report });
  } catch (e) {
    console.error("generate-report error", e);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}



