
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

const HUGGING_FACE_API_KEY = Deno.env.get("HUGGING_FACE_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BoundaryStatement {
  statement: string;
  explanation: string;
  situationFit: string;
  tone: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scenario, context = "", personalStyle = "assertive", specificConcerns = [] } = await req.json();
    
    if (!scenario) {
      throw new Error("Missing required parameter: scenario");
    }

    // Enhanced prompt for more nuanced and contextual responses
    const prompt = `As an AI specialized in interpersonal communication and boundary setting, generate 3 polite but clear boundary statements for the following scenario:

Scenario: ${scenario}
${context ? `Additional Context: ${context}` : ''}
Communication Style: ${personalStyle}
${specificConcerns.length > 0 ? `Specific Concerns to Address: ${specificConcerns.join(', ')}` : ''}

For each boundary statement:
1. Make it direct but respectful
2. Consider the provided context and communication style
3. Include constructive alternatives when appropriate
4. Ensure the tone matches the situation's formality
5. Focus on "I" statements and clear communication

Format each statement as a separate item in a JSON array with this structure:
[
  {
    "statement": "The actual boundary statement",
    "explanation": "Why this approach is effective",
    "situationFit": "Best context for using this statement (formal, casual, urgent, etc.)",
    "tone": "The communication tone (firm, gentle, professional, etc.)"
  }
]`;

    console.log("Calling Hugging Face API with enhanced prompt...");
    
    const hf = new HfInference(HUGGING_FACE_API_KEY);
    
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 1024,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.1,
        do_sample: true
      }
    });

    console.log("Received response from Hugging Face API");
    
    if (!response || !response.generated_text) {
      console.error("Empty or invalid response from Hugging Face API");
      throw new Error("Failed to generate boundary statements");
    }

    let statements: BoundaryStatement[] = [];
    try {
      // Enhanced JSON parsing with better error handling
      const content = response.generated_text.trim();
      const jsonStartIndex = content.indexOf('[');
      const jsonEndIndex = content.lastIndexOf(']') + 1;
      
      if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
        const jsonString = content.substring(jsonStartIndex, jsonEndIndex);
        statements = JSON.parse(jsonString);
        
        // Validate statement structure
        if (!Array.isArray(statements) || !statements.every(s => 
          typeof s.statement === 'string' && 
          typeof s.explanation === 'string' && 
          typeof s.situationFit === 'string' &&
          typeof s.tone === 'string')) {
          throw new Error("Invalid statement structure");
        }
      } else {
        throw new Error("No valid JSON found in response");
      }
    } catch (error) {
      console.error("Error parsing response:", error);
      statements = [
        {
          statement: "I appreciate your request, but I need to respectfully decline.",
          explanation: "A simple, direct statement that works in most situations",
          situationFit: "General purpose",
          tone: "Polite but firm"
        },
        {
          statement: "While I value our relationship, I need to set a boundary here.",
          explanation: "Acknowledges the relationship while establishing limits",
          situationFit: "Close relationships",
          tone: "Gentle but clear"
        },
        {
          statement: "Thank you for understanding that I need to prioritize my wellbeing in this situation.",
          explanation: "Focuses on self-care while remaining courteous",
          situationFit: "Personal matters",
          tone: "Compassionate"
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
