
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

    // Build prompt based on content type
    let prompt = ''
    switch (type) {
      case 'conversation_starters':
        const { relationshipName, interests, pastTopics, batteryLevel } = context
        prompt = `Generate 3 personalized conversation starters for ${relationshipName}.
                 Their interests include: ${interests.join(', ')}.
                 Past conversation topics: ${pastTopics.join(', ')}.
                 Current social battery level: ${batteryLevel}%.
                 Format response as JSON array with fields: topic, content, context, source.`
        break
      
      case 'meaningful_interaction':
        const { interactionType, relationship } = context
        prompt = `Generate a ${interactionType} interaction suggestion for a ${relationship.category} relationship.
                 Consider their interests: ${relationship.interests.join(', ')}.
                 Return a structured description with purpose and suggested activities.`
        break
      
      case 'communication_profile':
        const { preferences, style } = context
        prompt = `Create communication guidelines for someone with:
                 Style preference: ${style}
                 Social preferences: ${preferences.join(', ')}
                 Return concrete suggestions for effective communication.`
        break
        
      default:
        throw new Error('Invalid content type')
    }

    // Use text generation
    const response = await hf.textGeneration({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
      }
    })

    // Parse response based on type
    let parsedResponse
    try {
      if (type === 'conversation_starters') {
        // Extract JSON array from response
        const jsonMatch = response.generated_text.match(/\[.*\]/s)
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0])
        }
      } else {
        parsedResponse = response.generated_text
      }
    } catch (error) {
      console.error('Error parsing AI response:', error)
      throw new Error('Failed to parse AI response')
    }

    return new Response(
      JSON.stringify({ content: parsedResponse }),
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
