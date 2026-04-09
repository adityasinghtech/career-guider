// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BASE_PROMPT = `You are PathFinder AI, a helpful career guidance assistant for Indian students.
Rules:
* Speak in Hinglish
* Be friendly and supportive
* Give practical advice`;

async function generateResponse(messages: any[], systemPrompt: string) {
  if (!OPENROUTER_API_KEY) throw new Error("Missing OPENROUTER_API_KEY");

  const userMessage = messages[messages.length - 1]?.content || "";

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openrouter/auto",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  });

  const data = await res.json();

  if (data?.choices?.length) {
    return data.choices[0]?.message?.content || "No response";
  }

  if (data?.error) {
    return "API Error: " + data.error.message;
  }

  return "No AI response";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages = [], quizProfile } = await req.json();

    let systemPrompt = BASE_PROMPT;

    if (quizProfile) {
      systemPrompt += `
Student Profile:
* Stream: ${quizProfile.stream}
* Interests: ${(quizProfile.interests || []).join(", ")}
* Strengths: ${(quizProfile.strengths || []).join(", ")}
Give personalized advice.`;
    }

    const reply = await generateResponse(messages, systemPrompt);

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});