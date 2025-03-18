
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { type, context } = await req.json()
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_API_KEY'))

    // Construct prompt based on interaction type
    let prompt = ''
    switch (type) {
      case 'question':
        prompt = `Generate a thoughtful question for ${context}. The question should encourage meaningful conversation and self-reflection.`
        break
      case 'template':
        prompt = `Create a message template for ${context}. The template should be warm and authentic, allowing for personalization.`
        break
      case 'ritual':
        prompt = `Suggest a connection ritual for ${context}. Include frequency, structure, and potential conversation topics.`
        break
      case 'experience':
        prompt = `Recommend a shared experience for ${context}. Include activity details and discussion prompts.`
        break
      default:
        throw new Error('Invalid interaction type')
    }

    // Use text generation
    const response = await hf.textGeneration({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      inputs: prompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        top_p: 0.95,
      }
    })

    console.log('Generated response:', response)

    // Parse and structure the response
    const generatedContent = {
      type,
      content: response.generated_text,
      timestamp: new Date().toISOString()
    }

    return new Response(
      JSON.stringify(generatedContent),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
