
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const HF_API_KEY = Deno.env.get('HUGGING_FACE_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { practiceRequest } = await req.json();
    console.log(`Generating personalized mindfulness practice with focus areas: ${practiceRequest.focusAreas.join(', ')}`);

    // Create a detailed prompt for the AI model
    const prompt = `
Create a detailed mindfulness meditation script for introverts with the following parameters:
- Duration: ${practiceRequest.duration} minutes
- Focus areas: ${practiceRequest.focusAreas.join(', ')}
- Situation: ${practiceRequest.situationType}${practiceRequest.situationDetails ? ` - ${practiceRequest.situationDetails}` : ''}
- Goal: ${practiceRequest.goalStatement || 'General wellbeing'}
- Preferred techniques: ${practiceRequest.preferredElements.join(', ') || 'Any appropriate technique'}

The script should include:
1. A brief introduction (1 minute)
2. A body scan section (1-2 minutes)
3. The main practice focusing on the specified areas (${practiceRequest.duration - 5} minutes)
4. A closing section (1-2 minutes)

The practice should be specifically tailored for introverts, addressing their unique needs and experiences.
Make the script warm, supportive, and use inclusive language.
`;

    // Call Hugging Face Inference API
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `<s>[INST] ${prompt} [/INST]`,
        parameters: {
          max_new_tokens: 1500,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Hugging Face API error:", error);
      throw new Error(`Hugging Face API error: ${error}`);
    }

    const result = await response.json();
    let generatedScript = result[0]?.generated_text || "";
    
    // Clean up the response to extract just the model's answer
    const pattern = /<s>\[INST\].*?\[\/INST\](.*?)<\/s>/s;
    const match = generatedScript.match(pattern);
    if (match && match[1]) {
      generatedScript = match[1].trim();
    }

    // Generate a descriptive title based on the focus areas
    const mainFocus = practiceRequest.focusAreas[0] || "Mindfulness";
    let title = `${mainFocus} Practice`;
    if (practiceRequest.focusAreas.length > 1) {
      title = `${mainFocus} & ${practiceRequest.focusAreas[1]} Practice`;
    }
    if (practiceRequest.situationType && practiceRequest.situationType !== "Other") {
      title = `${title} for ${practiceRequest.situationType}`;
    }

    // Create the practice object
    const practice = {
      id: `custom-${Date.now()}`,
      title: title,
      category: practiceRequest.focusAreas[0] || "Custom Practice",
      subcategory: practiceRequest.situationType || "Custom Practice",
      duration: practiceRequest.duration,
      description: `A personalized ${practiceRequest.duration}-minute practice focused on ${practiceRequest.focusAreas.join(", ")}.${practiceRequest.goalStatement ? ` Goal: ${practiceRequest.goalStatement}` : ''}`,
      script: generatedScript,
      tags: [...practiceRequest.focusAreas, ...practiceRequest.preferredElements],
      energyImpact: practiceRequest.focusAreas.includes("Energy Conservation") ? -3 : practiceRequest.focusAreas.includes("Preparation") ? 1 : -2,
      expertReviewed: false
    };

    return new Response(
      JSON.stringify({ practice }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
