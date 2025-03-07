
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

const HUGGING_FACE_API_KEY = Deno.env.get("HUGGING_FACE_API_KEY");

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

    // Create a prompt for the Hugging Face model based on the event information
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

    console.log("Calling Hugging Face API...");
    
    // Initialize the Hugging Face inference client
    const hf = new HfInference(HUGGING_FACE_API_KEY);
    
    // Call Hugging Face API with a text generation model
    // Using Mistral-7B which is a good balance of quality and speed
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 2048,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.1
      }
    });

    console.log("Hugging Face API response received");
    
    if (!response || !response.generated_text) {
      console.error("Empty or invalid response from Hugging Face API");
      throw new Error("Failed to generate content from Hugging Face API");
    }

    // Extract the generated memo from Hugging Face's response
    const memo = response.generated_text.trim();
    console.log("Memo generated successfully");

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
