
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

const HUGGING_FACE_API_KEY = Deno.env.get("HUGGING_FACE_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProfileRequest {
  communicationStyle?: string;
  socialPreferences?: string;
  energyLevels?: string;
  situationContext?: string;
  existingProfile?: any;
  requestType: 'generate-profile' | 'enhance-profile' | 'generate-phrases';
}

interface CommunicationProfile {
  channelPreferences: {
    rankedChannels: { channel: string; preference: number }[];
    responseTimeframes: {
      email: number;
      text: number;
      voiceCall: number;
      videoCall: number;
    };
    urgencyOverrides: {
      allowCall: boolean;
      urgentResponseTime: number;
    };
  };
  interactionStyle: {
    conversationDepth: number;
    preferredTopics: string[];
    avoidTopics: string[];
    preparationNeeded: number;
    interruptionComfort: number;
  };
  boundaries: {
    groupSizePreference: {
      min: number;
      ideal: number;
      max: number;
    };
    durationLimits: {
      idealDuration: number;
      maxDuration: number;
      breakFrequency: number;
    };
    advanceNotice: {
      preferred: number;
      minimum: number;
    };
  };
  energyManagement: {
    depletionSignals: string[];
    exitPhrases: string[];
    recoveryNeeds: {
      afterSmallEvent: number;
      afterLargeEvent: number;
    };
    checkInPreference: 'none' | 'subtle' | 'direct';
  };
}

interface CommunicationPhrases {
  introductions: string[];
  boundaries: string[];
  exitStrategies: string[];
  followUps: string[];
  explanation: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: ProfileRequest = await req.json();
    console.log("Request received:", JSON.stringify(request, null, 2));
    
    if (!request.requestType) {
      throw new Error("Missing required parameter: requestType");
    }

    const hf = new HfInference(HUGGING_FACE_API_KEY);
    
    let prompt = "";
    let response;
    
    switch (request.requestType) {
      case 'generate-profile':
        prompt = generateProfilePrompt(request);
        console.log("Generating profile with prompt:", prompt);
        response = await generateWithAI(hf, prompt);
        return new Response(
          JSON.stringify({ profile: parseProfileResponse(response) }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
        
      case 'enhance-profile':
        if (!request.existingProfile) {
          throw new Error("Missing required parameter: existingProfile");
        }
        prompt = enhanceProfilePrompt(request);
        console.log("Enhancing profile with prompt:", prompt);
        response = await generateWithAI(hf, prompt);
        return new Response(
          JSON.stringify({ enhancements: parseEnhancementResponse(response) }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
        
      case 'generate-phrases':
        prompt = generatePhrasesPrompt(request);
        console.log("Generating phrases with prompt:", prompt);
        response = await generateWithAI(hf, prompt);
        return new Response(
          JSON.stringify({ phrases: parsePhrasesResponse(response) }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
        
      default:
        throw new Error(`Unsupported request type: ${request.requestType}`);
    }
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});

async function generateWithAI(hf: HfInference, prompt: string): Promise<string> {
  console.log("Calling Hugging Face API...");
  
  const response = await hf.textGeneration({
    model: "mistralai/Mistral-7B-Instruct-v0.2",
    inputs: prompt,
    parameters: {
      max_new_tokens: 1500,
      temperature: 0.7,
      top_p: 0.95,
      repetition_penalty: 1.1,
      do_sample: true
    }
  });

  console.log("Received response from Hugging Face API");
  
  if (!response || !response.generated_text) {
    console.error("Empty or invalid response from Hugging Face API");
    throw new Error("Failed to generate response");
  }
  
  return response.generated_text;
}

function generateProfilePrompt(request: ProfileRequest): string {
  return `As an AI specialized in interpersonal communication and personality insights, generate a detailed communication profile based on the following information:

Communication Style: ${request.communicationStyle || "Not specified"}
Social Preferences: ${request.socialPreferences || "Not specified"}
Energy Levels: ${request.energyLevels || "Not specified"}
Context: ${request.situationContext || "General use"}

Create a comprehensive communication profile with these sections:

1. Channel Preferences (ranked channels, response timeframes, urgency overrides)
2. Interaction Style (conversation depth, preferred topics, avoided topics, preparation needed, interruption comfort)
3. Boundaries (group size preferences, duration limits, advance notice needs)
4. Energy Management (depletion signals, exit phrases, recovery needs, check-in preferences)

Format your response as a well-structured JSON object following this exact schema:
{
  "channelPreferences": {
    "rankedChannels": [
      { "channel": "string", "preference": number from 1-5 }
    ],
    "responseTimeframes": {
      "email": number (hours),
      "text": number (hours),
      "voiceCall": number (hours),
      "videoCall": number (hours)
    },
    "urgencyOverrides": {
      "allowCall": boolean,
      "urgentResponseTime": number (minutes)
    }
  },
  "interactionStyle": {
    "conversationDepth": number from 1-10,
    "preferredTopics": [array of strings],
    "avoidTopics": [array of strings],
    "preparationNeeded": number from 1-10,
    "interruptionComfort": number from 1-10
  },
  "boundaries": {
    "groupSizePreference": {
      "min": number,
      "ideal": number,
      "max": number
    },
    "durationLimits": {
      "idealDuration": number (minutes),
      "maxDuration": number (minutes),
      "breakFrequency": number (minutes)
    },
    "advanceNotice": {
      "preferred": number (days),
      "minimum": number (days)
    }
  },
  "energyManagement": {
    "depletionSignals": [array of strings],
    "exitPhrases": [array of strings],
    "recoveryNeeds": {
      "afterSmallEvent": number (hours),
      "afterLargeEvent": number (hours)
    },
    "checkInPreference": "none" | "subtle" | "direct"
  }
}

Make sure the profile is realistic, internally consistent, and tailored to the provided information. Include 3-5 items in array fields.`;
}

function enhanceProfilePrompt(request: ProfileRequest): string {
  const existingProfile = JSON.stringify(request.existingProfile, null, 2);
  
  return `As an AI specialized in interpersonal communication, analyze and enhance this communication profile:

${existingProfile}

Context: ${request.situationContext || "General improvement"}

Provide specific enhancements to make this profile more effective, authentic, and helpful. Focus on:

1. Identifying any inconsistencies or areas that could be improved
2. Suggesting more personalized options based on the overall pattern
3. Refining the exit phrases and depletion signals to be more natural
4. Balancing the profile for better social interactions

Format your response as a JSON object with these sections:
{
  "inconsistencies": [array of string descriptions],
  "improvements": {
    "channelPreferences": {object with suggested changes},
    "interactionStyle": {object with suggested changes},
    "boundaries": {object with suggested changes},
    "energyManagement": {object with suggested changes}
  },
  "newSuggestions": {
    "exitPhrases": [array of new suggested phrases],
    "depletionSignals": [array of new suggested signals],
    "preferredTopics": [array of new suggested topics]
  },
  "explanation": "string explaining the reasoning behind your suggestions"
}`;
}

function generatePhrasesPrompt(request: ProfileRequest): string {
  const profile = request.existingProfile ? JSON.stringify(request.existingProfile, null, 2) : "Not provided";
  
  return `As an AI specialized in interpersonal communication, generate helpful communication phrases based on this profile:

${profile}

Context: ${request.situationContext || "General communication"}
Communication Style: ${request.communicationStyle || "Not specified"}

Create 4 categories of phrases that would help this person communicate effectively:

1. Introduction phrases for first meetings or starting conversations
2. Boundary-setting phrases that match their comfort level
3. Exit strategies that align with their energy management needs
4. Follow-up communication templates that match their style

Format your response as a JSON object with these sections:
{
  "introductions": [array of 3-5 natural-sounding phrases],
  "boundaries": [array of 3-5 natural-sounding phrases],
  "exitStrategies": [array of 3-5 natural-sounding phrases],
  "followUps": [array of 3-5 natural-sounding phrases or templates],
  "explanation": "string explaining how these phrases match the profile"
}

Make the phrases sound natural, conversational and aligned with the person's communication style. They should not sound robotic or overly formal unless that matches the profile.`;
}

function parseProfileResponse(response: string): Partial<CommunicationProfile> {
  try {
    // Extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response:", response);
      throw new Error("Failed to extract profile JSON from response");
    }

    const jsonString = jsonMatch[0];
    const profile = JSON.parse(jsonString);
    
    // Validate basic structure
    if (!profile.channelPreferences || !profile.interactionStyle || 
        !profile.boundaries || !profile.energyManagement) {
      console.error("Invalid profile structure:", profile);
      throw new Error("Generated profile is missing required sections");
    }
    
    return profile;
  } catch (error) {
    console.error("Error parsing profile response:", error);
    throw new Error(`Failed to parse profile: ${error.message}`);
  }
}

function parseEnhancementResponse(response: string): any {
  try {
    // Extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response:", response);
      throw new Error("Failed to extract enhancements JSON from response");
    }

    const jsonString = jsonMatch[0];
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing enhancement response:", error);
    throw new Error(`Failed to parse enhancements: ${error.message}`);
  }
}

function parsePhrasesResponse(response: string): CommunicationPhrases {
  try {
    // Extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response:", response);
      throw new Error("Failed to extract phrases JSON from response");
    }

    const jsonString = jsonMatch[0];
    const phrases = JSON.parse(jsonString);
    
    // Validate basic structure and provide defaults if missing
    return {
      introductions: Array.isArray(phrases.introductions) ? phrases.introductions : [],
      boundaries: Array.isArray(phrases.boundaries) ? phrases.boundaries : [],
      exitStrategies: Array.isArray(phrases.exitStrategies) ? phrases.exitStrategies : [],
      followUps: Array.isArray(phrases.followUps) ? phrases.followUps : [],
      explanation: phrases.explanation || "Generated communication phrases based on your profile"
    };
  } catch (error) {
    console.error("Error parsing phrases response:", error);
    throw new Error(`Failed to parse phrases: ${error.message}`);
  }
}
