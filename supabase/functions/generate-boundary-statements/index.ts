
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
    const { scenario, context = "", personalStyle = "assertive" } = await req.json();
    
    if (!scenario) {
      throw new Error("Missing required parameter: scenario");
    }

    // Create a prompt for the Hugging Face model
    const prompt = `Generate 3 polite but clear boundary statements for the following scenario:

Scenario: ${scenario}
${context ? `Additional Context: ${context}` : ''}
Personal Communication Style: ${personalStyle}

For each boundary statement:
1. Provide a direct statement that clearly establishes the boundary
2. Make it polite but firm
3. Offer an alternative if appropriate

Format each statement as a separate item in a JSON array with the following structure:
[
  {
    "statement": "The boundary statement text here",
    "explanation": "Brief explanation of why this works well",
    "situationFit": "When this statement works best (formal, casual, urgent, etc.)"
  }
]`;

    console.log("Calling Hugging Face API for boundary statements...");
    
    // Initialize the Hugging Face inference client
    const hf = new HfInference(HUGGING_FACE_API_KEY);
    
    // Call Hugging Face API with a text generation model
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 1024,
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

    let statements = [];
    try {
      // Try to parse JSON from the response
      const content = response.generated_text.trim();
      const jsonStartIndex = content.indexOf('[');
      const jsonEndIndex = content.lastIndexOf(']') + 1;
      
      if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
        const jsonString = content.substring(jsonStartIndex, jsonEndIndex);
        statements = JSON.parse(jsonString);
      } else {
        // Fallback to parsing the text if not properly formatted
        throw new Error("Unable to parse JSON from response");
      }
    } catch (error) {
      console.error("Error parsing Hugging Face response:", error);
      // Create a basic set of fallback statements
      statements = [
        {
          statement: "I appreciate the invitation, but I need to decline at this time.",
          explanation: "A simple, direct statement that works in most situations",
          situationFit: "Casual"
        },
        {
          statement: "Thank you for thinking of me, but I'm not comfortable with that request.",
          explanation: "Acknowledges the other person while clearly stating your boundary",
          situationFit: "General purpose"
        },
        {
          statement: "I value our relationship, but I need to set a boundary on this matter.",
          explanation: "Affirms the relationship while establishing the boundary",
          situationFit: "Close relationships"
        }
      ];
    }

    return new Response(JSON.stringify({ statements }), {
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
