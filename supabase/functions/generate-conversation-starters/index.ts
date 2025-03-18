
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// HF API endpoint for text generation
const HF_API_ENDPOINT = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
const HF_API_KEY = Deno.env.get("HUGGING_FACE_API_KEY");

// Handle CORS preflight requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the request body
    const { relationshipId, relationshipName, interests, pastTopics, batteryLevel } = await req.json();

    if (!relationshipId || !relationshipName) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: relationshipId and relationshipName are required"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Generating conversation starters for ${relationshipName} with battery level ${batteryLevel}`);

    // Convert battery level to an energy-appropriate description
    let energyState = "high energy";
    if (batteryLevel < 30) {
      energyState = "very low energy, needs simple interactions";
    } else if (batteryLevel < 50) {
      energyState = "low energy, prefers low-effort conversations";
    } else if (batteryLevel < 70) {
      energyState = "moderate energy";
    }

    // Construct the prompt for the AI model
    const prompt = `<s>[INST] You are an AI assistant helping an introvert generate personalized conversation starters for a relationship. Generate 3 conversation starters for the person named "${relationshipName}".

Context:
- Current social battery level: ${batteryLevel}% (${energyState})
- Shared interests: ${interests?.join(", ") || "Unknown"}
- Past conversation topics: ${pastTopics?.join(", ") || "None recorded"}

For each conversation starter:
1. Make it natural, personalized and specific to the shared interests
2. Keep it appropriate for the user's current energy level
3. Make it open-ended to encourage dialogue
4. Avoid generic questions like "how are you?"

Format your response as a JSON array with objects containing: "topic", "content", "context", and "source". 
Example format:
[
  {
    "topic": "Photography exhibition",
    "content": "I saw there's a new photography exhibition downtown this weekend. Given your interest in street photography, I thought you might want to check it out?",
    "context": "Based on shared interest in photography",
    "source": "interest"
  }
]

Return ONLY the JSON array with no additional text or formatting. [/INST]</s>`;

    // Generate the conversation starters using Hugging Face API
    const response = await fetch(HF_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${HF_API_KEY}`,
      },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 1024 } }),
    });

    if (!response.ok) {
      console.error("Error from Hugging Face API:", await response.text());
      return new Response(
        JSON.stringify({ error: "Failed to generate conversation starters" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const aiResponse = await response.json();
    console.log("AI response:", aiResponse);

    // Extract and parse the JSON part from the AI response
    let jsonResponseText = aiResponse[0].generated_text;
    // Remove everything before the first [
    jsonResponseText = jsonResponseText.substring(jsonResponseText.indexOf("["));
    // Remove everything after the last ]
    jsonResponseText = jsonResponseText.substring(0, jsonResponseText.lastIndexOf("]") + 1);

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(jsonResponseText);
    } catch (error) {
      console.error("Failed to parse AI response as JSON:", error);
      console.log("Raw response:", jsonResponseText);
      
      // Fallback to a simple response
      jsonResponse = [
        {
          topic: interests?.[0] || "Recent activities",
          content: `I've been thinking about ${interests?.[0] || "trying something new"} lately. Have you had any experiences with that recently?`,
          context: `Based on ${interests?.length ? "shared interest" : "general conversation"}`,
          source: interests?.length ? "interest" : "general"
        },
        {
          topic: "Weekend plans",
          content: "Do you have anything interesting planned for the weekend?",
          context: "Casual conversation starter",
          source: "general"
        },
        {
          topic: "Recent discovery",
          content: "I recently discovered a new [hobby/book/show] that I think you might enjoy. Would you be interested in hearing about it?",
          context: "Sharing personal experience",
          source: "personal"
        }
      ];
    }

    return new Response(
      JSON.stringify({ 
        starters: jsonResponse,
        message: "Successfully generated conversation starters" 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating conversation starters:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
