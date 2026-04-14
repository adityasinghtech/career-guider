// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { stream, subject, topic, difficulty, numQuestions, userId } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    // Rate Limiting Logic
    if (userId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
      if (supabaseUrl && supabaseServiceKey) {
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
        
        const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
        const { count, error: countError } = await supabaseAdmin
          .from("analytics_events")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("event_name", "practice_quiz_used")
          .gte("created_at", oneHourAgo);

        if (countError) {
          console.error("Error fetching rate limit count:", countError);
        }

        if (count !== null && count >= 10) {
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded. Maximum 10 requests allowed per hour." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Insert usage event
        await supabaseAdmin.from("analytics_events").insert({
          event_name: "practice_quiz_used",
          user_id: userId,
          properties: { stream, subject, topic }
        });
      }
    }

    const prompt = `Generate ${numQuestions} multiple choice questions for Indian Class 11-12 students.
Stream: ${stream}, Subject: ${subject}, Topic: ${topic}, Difficulty: ${difficulty}

For each question return JSON array with this exact structure:
[{
  "question": "Question text here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": "Option A",
  "explanation": "Why this is correct - 2-3 sentences",
  "conceptBridge": "How this relates to entrance exams like JEE/NEET/CUET"
}]

Return ONLY the JSON array, no other text.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-3.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error:", errText);
      throw new Error(`Gemini API generated an error: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Attempt to extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("Failed to parse AI response:", text);
      throw new Error("Failed to extract JSON array from AI response.");
    }
    
    let questions = [];
    try {
      questions = JSON.parse(jsonMatch[0]);
    } catch (e) {
      throw new Error("Invalid JSON returned by AI.");
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Edge function error:", errorMsg);
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
