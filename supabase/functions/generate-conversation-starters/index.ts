
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
    const { eventType, userInterests, attendees } = await req.json();
    
    // Create a prompt for Claude based on the event information
    const prompt = `Generate 10 natural conversation starters for a ${eventType} event.
    
    The user's interests include: ${userInterests || "various topics"}.
    
    ${attendees ? `People attending include: ${attendees}.` : ""}
    
    For each conversation starter:
    1. Provide the starter question or comment
    2. Include a brief explanation of why this works well
    3. Add a follow-up question to keep the conversation going
    4. Categorize as: casual, professional, topical, or personal
    
    Format as JSON array with fields: starter, explanation, followUp, category`;

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

    let starters = [];
    try {
      // Try to parse JSON from the response
      const content = data.content[0].text;
      const jsonStartIndex = content.indexOf('[');
      const jsonEndIndex = content.lastIndexOf(']') + 1;
      
      if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
        const jsonString = content.substring(jsonStartIndex, jsonEndIndex);
        starters = JSON.parse(jsonString);
      } else {
        // Fallback to parsing the text if not properly formatted
        throw new Error("Unable to parse JSON from response");
      }
    } catch (error) {
      console.error("Error parsing Claude response:", error);
      // Create a basic set of fallback starters
      starters = [
        {
          starter: "Have you been to an event like this before?",
          explanation: "Simple ice breaker that works in most situations",
          followUp: "What did you enjoy most about it?",
          category: "casual"
        },
        {
          starter: "I'm curious what brought you here today?",
          explanation: "Opens up discussion about shared interests",
          followUp: "How long have you been interested in that?",
          category: "casual"
        }
      ];
    }

    return new Response(JSON.stringify({ starters }), {
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
