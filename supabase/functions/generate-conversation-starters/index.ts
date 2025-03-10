
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
    const { eventType, userInterests, attendees } = await req.json();
    
    // Create a prompt for the model based on the event information
    const prompt = `Generate 10 natural conversation starters for a ${eventType} event.
    
    The user's interests include: ${userInterests || "various topics"}.
    
    ${attendees ? `People attending include: ${attendees}.` : ""}
    
    For each conversation starter:
    1. Provide the starter question or comment
    2. Include a brief explanation of why this works well
    3. Add a follow-up question to keep the conversation going
    4. Categorize as: casual, professional, topical, or personal
    
    Format as JSON array with fields: starter, explanation, followUp, category`;

    console.log("Calling Hugging Face API for conversation starters...");
    
    // Initialize the Hugging Face inference client
    const hf = new HfInference(HUGGING_FACE_API_KEY);
    
    // Call Hugging Face API with a text generation model
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 4096,
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

    let starters = [];
    try {
      // Try to parse JSON from the response
      const content = response.generated_text.trim();
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
      console.error("Error parsing Hugging Face response:", error);
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
