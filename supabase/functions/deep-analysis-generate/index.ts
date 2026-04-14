// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { marks10th, marks12th, stream, interests, personality, budget, location, userId } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    // Insert usage event (Disabled until analytics_events table is created)
    /*
    if (userId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
      if (supabaseUrl && supabaseServiceKey) {
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
        
        // Insert usage event
        await supabaseAdmin.from("analytics_events").insert({
          event_name: "deep_analysis_used",
          user_id: userId,
          properties: { stream, interests }
        });
      }
    }
    */

    const prompt = `You are an expert Indian career counselor. Analyze this student profile and give comprehensive guidance.

Student Profile:
- 10th Marks: ${marks10th || "Not provided"}%
- 12th Marks: ${marks12th || "Not provided"}%
- Stream: ${stream || "Not specified"}
- Interests: ${(interests || []).join(", ") || "Not specified"}
- Personality: ${personality}
- Budget: ${budget}
- Location: ${location}

Return a JSON object with EXACTLY this structure (no extra text):
{
  "psychological_aptitude": {
    "strengths": ["strength1", "strength2", "strength3"],
    "learning_style": "Visual/Practical/Theoretical learner description",
    "career_personality": "What kind of work environment suits them"
  },
  "financial_feasibility": {
    "estimated_4year_cost": "₹X - ₹Y lakhs",
    "scholarship_potential": "High/Medium/Low with reasons",
    "roi_timeline": "Estimated years to recoup education cost"
  },
  "top_careers": [
    {"title": "Career Name", "salary": "₹X-Y LPA", "demand": "High/Medium/Low", "path": "How to reach this career"}
  ],
  "target_colleges": [
    {"name": "College Name", "location": "City, State", "fees": "₹X/year", "exam": "Entrance exam needed"}
  ],
  "structured_roadmap": {
    "now": ["Action 1", "Action 2", "Action 3"],
    "year1": ["Year 1 milestone 1", "Year 1 milestone 2"],
    "year2": ["Year 2 milestone 1", "Year 2 milestone 2"],
    "longterm": ["5 year goal 1", "5 year goal 2"]
  },
  "backup_paths": [
    {"title": "Backup Option", "description": "Why this is a good backup"}
  ],
  "competition_level": "This field has X competition level because...",
  "success_tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4"]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
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
      throw new Error(`AI Service Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    if (!text) {
      console.error("Empty response from Gemini:", JSON.stringify(data));
      throw new Error("AI ne koi answer nahi diya. Thodi der baad try karein.");
    }

    // Attempt to extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Failed to parse AI response:", text);
      throw new Error("AI did not return valid JSON. Response was: " + text.substring(0, 100) + "...");
    }
    
    let analysis;
    try {
      analysis = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      throw new Error("Invalid JSON structure in AI response.");
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Edge function error:", errorMsg);
    // Returning 200 so the frontend can read the error JSON instead of generic 'non-2xx' error
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
