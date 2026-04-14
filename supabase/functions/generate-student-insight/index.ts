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
    const { studentId } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured.");
    
    // Auth check - Admin only
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), { status: 401, headers: corsHeaders });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleData?.role !== 'admin') {
      return new Response(JSON.stringify({ error: "Forbidden: Admin access required" }), { status: 403, headers: corsHeaders });
    }

    // Fetch Student Data
    const { data: studentProfile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', studentId)
      .single();

    if (!studentProfile) throw new Error("Student profile not found");

    const [{ data: results }, { data: messages }, { data: suggestions }] = await Promise.all([
      supabaseClient.from('quiz_results').select('*').eq('user_id', studentId),
      supabaseClient.from('contact_messages').select('*').eq('email', studentProfile.email),
      supabaseClient.from('admin_suggestions').select('*').eq('user_id', studentId)
    ]);

    const studentContext = {
      profile: studentProfile,
      quiz_results: results || [],
      contact_messages: messages || [],
      previous_suggestions: suggestions || []
    };

    const prompt = `You are a professional career counselor. Analyze this student's data and provide a concise JSON summary.
      
      Student Profile:
      - Name: ${studentProfile.full_name}
      - Class: ${studentProfile.class}
      - Career Goal: ${studentProfile.career_goal}
      - Bio: ${studentProfile.bio}
      
      Quiz Results: ${JSON.stringify(results?.map(r => ({ stream: r.stream, date: r.created_at })))}
      Recent Messages: ${JSON.stringify(messages?.map(m => ({ text: m.message, date: m.created_at })))}
      
      Analyze this data and return EXACTLY this JSON structure:
      {
        "summary": "One-line summary of their situation",
        "concern": "Top concern (confusion/low performance/financial/family pressure/etc)",
        "action": "Recommended next action for admin/counselor",
        "suggestedPath": "Suggested career path based on quiz results"
      }
      
      Avoid any pleasantries, just return the JSON object.`;

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
      const errTxt = await response.text();
      throw new Error(`Gemini API Error: ${response.status} - ${errTxt}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Raw AI response:", text);
      throw new Error("AI did not return valid JSON");
    }
    
    const insight = JSON.parse(jsonMatch[0]);

    // Store in admin_suggestions
    await supabaseClient
      .from('admin_suggestions')
      .insert({
        user_id: studentId,
        admin_id: user.id,
        message: `🔍 SMART INSIGHT:\n\n📝 Summary: ${insight.summary}\n⚠️ Top Concern: ${insight.concern}\n🚀 Next Action: ${insight.action}\n🎯 Path: ${insight.suggestedPath}`,
        is_read: false
      });

    return new Response(JSON.stringify(insight), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in generate-student-insight:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
