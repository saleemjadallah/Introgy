
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const CLAUDE_API_KEY = Deno.env.get("CLAUDE_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      event, 
      batteryLevel,
      userPreferences = {} 
    } = await req.json();

    // Create a prompt for Claude based on the event information
    const prompt = `Generate a detailed preparation memo for the following social event:

Event Name: ${event.name}
Event Type: ${event.eventType}
Date: ${new Date(event.date).toLocaleString()}
${event.location ? `Location: ${event.location}` : ''}
People Count: ${event.peopleCount}
${event.knownAttendees?.length ? `Known Attendees: ${event.knownAttendees.join(', ')}` : ''}
Energy Cost (1-10): ${event.energyCost}
${event.duration ? `Duration: ${event.duration} minutes` : ''}
${event.notes ? `Additional Notes: ${event.notes}` : ''}

Current Social Battery Level: ${batteryLevel}%

Based on this information, please create a personalized preparation memo that includes:

1. A summary of the event and its significance
2. Detailed preparation steps (what to bring, what to wear, timing logistics)
3. Mental preparation strategies specific to this event type
4. Social energy management tips (given the current battery level of ${batteryLevel}%)
5. Key points to remember during the event
6. Post-event recovery recommendations

Format the memo in Markdown with clear sections and concise advice. Keep it practical, supportive, and tailored to someone who values preparation and energy management for social situations.`;

    // Call Claude API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Claude API error:", data);
      throw new Error(`Claude API error: ${data.error?.message || "Unknown error"}`);
    }

    // Extract the generated memo from Claude's response
    const memo = data.content[0].text;

    return new Response(JSON.stringify({ memo }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Function error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
