
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
    const { contentType, query } = await req.json();
    console.log(`Generating ${contentType} content with query: ${query}`);

    // Select the appropriate prompt based on content type
    let prompt = "";
    switch(contentType) {
      case "glossary":
        prompt = `Define this psychology term for introverts: "${query}". Include the definition, relevance to introverts, and a practical example.`;
        break;
      case "mythbuster":
        prompt = `Debunk this myth about introverts: "${query}". Explain the reality, scientific evidence, and how this misconception affects introverts.`;
        break;
      case "famous":
        prompt = `Create a profile about ${query}, focusing on their introvert traits. Include: their personality traits, how introversion influenced their work, and inspirational insights for other introverts.`;
        break;
      default:
        prompt = `Provide information about ${query} in the context of introvert psychology.`;
    }

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
          max_new_tokens: 500,
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
    let generatedContent = result[0]?.generated_text || "";
    
    // Clean up the response to extract just the model's answer
    const pattern = /<s>\[INST\].*?\[\/INST\](.*?)<\/s>/s;
    const match = generatedContent.match(pattern);
    if (match && match[1]) {
      generatedContent = match[1].trim();
    }

    return new Response(
      JSON.stringify({ content: generatedContent }),
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
