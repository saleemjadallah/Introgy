
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { userMessage, scenario, conversationHistory } = await req.json();
    
    if (!userMessage || !scenario) {
      throw new Error("Missing required parameters: userMessage or scenario");
    }
    
    // Create system prompt based on scenario
    const systemPrompt = `You are simulating a conversation in the "${scenario.name}" scenario. 
    You are playing the role of a ${scenario.personaType} in a ${scenario.type} situation.
    
    Scenario details:
    - Type: ${scenario.type} (e.g., professional, social, challenging, daily)
    - Difficulty: ${scenario.difficulty} (beginner, intermediate, advanced)
    - Duration: ${scenario.duration} (quick, short, extended)
    - Description: ${scenario.description}
    
    Your response should:
    1. Stay completely in character as a ${scenario.personaType}
    2. Match the tone appropriate for this ${scenario.type} scenario
    3. Include appropriate follow-up questions or conversation continuers
    4. Be appropriately challenging based on the scenario difficulty: ${scenario.difficulty}
    5. Be natural and conversational, about 1-3 sentences
    
    Remember that you are NOT an AI assistant in this conversation - you are simulating a real person.`;
    
    // Prepare messages for the API
    const messages = [
      { role: "system", content: systemPrompt },
      // Include conversation history limited to last 8 messages (excluding system)
      ...conversationHistory
        .filter(msg => msg.role !== "system")
        .slice(-8)
        .map(msg => ({ 
          role: msg.role, 
          content: msg.content 
        }))
    ];
    
    // Attempt to use Hugging Face inference if API key is available
    const HUGGING_FACE_API_KEY = Deno.env.get('HUGGING_FACE_API_KEY');
    
    if (HUGGING_FACE_API_KEY) {
      console.log("Using Hugging Face API for conversation response");
      
      try {
        const huggingFaceResponse = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            inputs: `<s>[INST] ${systemPrompt} [/INST]
            
            Previous conversation:
            ${conversationHistory.slice(-8).map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')}
            
            User: ${userMessage}
            
            Assistant:`,
            parameters: {
              max_new_tokens: 150,
              temperature: 0.7,
              top_p: 0.95,
              do_sample: true,
              return_full_text: false
            }
          })
        });
        
        const result = await huggingFaceResponse.json();
        
        if (result && result[0] && result[0].generated_text) {
          // Clean up response - sometimes the model adds formatting we don't want
          let cleanedResponse = result[0].generated_text.trim();
          
          // Remove any "Assistant:" prefixes if they appear
          cleanedResponse = cleanedResponse.replace(/^Assistant:\s*/i, "");
          
          return new Response(JSON.stringify({ response: cleanedResponse }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200
          });
        }
      } catch (error) {
        console.error("Hugging Face API error:", error);
        // Fall through to fallback method
      }
    }
    
    // Fallback method if Hugging Face fails or isn't configured
    // Create a context-aware response using pattern matching
    console.log("Using fallback response generation");
    
    const userMessageLower = userMessage.toLowerCase();
    const topics = [
      "work", "job", "career", "project", "team", "meeting", "interview", 
      "friend", "family", "relationship", "party", "social", "event",
      "boundary", "time", "busy", "stress", "pressure", "help", "support",
      "conflict", "disagreement", "problem", "issue", "challenge", "weekend",
      "hobby", "interest", "travel", "food", "movie", "book", "music", "show"
    ];
    
    // Find mentioned topics
    const mentionedTopics = topics.filter(topic => userMessageLower.includes(topic));
    const mainTopic = mentionedTopics.length > 0 ? mentionedTopics[0] : null;
    
    // Generate response based on scenario and context
    let response = "";
    
    // Check if user is asking a question
    const isQuestion = userMessageLower.includes("?") || 
                      userMessageLower.startsWith("what") || 
                      userMessageLower.startsWith("how") || 
                      userMessageLower.startsWith("why");
    
    // Base responses on scenario type and persona type
    if (scenario.type === "professional") {
      if (scenario.personaType === "direct communicator") {
        if (isQuestion) {
          response = `From my experience, ${mainTopic || "this"} is all about efficiency and clear communication. What specifically about ${mainTopic || "this situation"} are you finding challenging?`;
        } else {
          response = `I appreciate your perspective. In my role, I've found that being direct about ${mainTopic || "these matters"} saves everyone time and prevents misunderstandings. Would you agree?`;
        }
      } else {
        response = `That's an interesting point about ${mainTopic || "that topic"}. In previous situations like this, I've found collaborating on solutions works best. Have you considered alternative approaches?`;
      }
    } else if (scenario.type === "social") {
      if (scenario.personaType === "rambler") {
        response = `Oh that reminds me of this time when I was dealing with ${mainTopic || "something similar"}! It was last summer, or maybe fall? Anyway, I was with some friends and we were just talking about how these situations can be so interesting. Do you find that happens to you often?`;
      } else {
        response = `I've been in similar situations with ${mainTopic || "things like that"}. It's always interesting to hear different perspectives. What else have you been up to lately?`;
      }
    } else if (scenario.type === "challenging") {
      if (scenario.personaType === "close-talker") {
        response = `I really need your help with this ${mainTopic || "situation"}. It's super important to me, and I know you'd be great at it. So you'll do it, right? I'm counting on you.`;
      } else {
        response = `I understand what you're saying about ${mainTopic || "this"}, but I have to be honest - I have some concerns. Can we discuss a compromise that might work for both of us?`;
      }
    } else if (scenario.type === "daily") {
      response = `I've been noticing the same thing about ${mainTopic || "that"} lately. It's one of those everyday things people don't talk about enough. What do you think about it?`;
    }
    
    // If no specific response was generated, use a generic context-aware one
    if (!response) {
      const genericResponses = [
        `That's an interesting perspective on ${mainTopic || "this topic"}. I'd like to hear more about your experience with it.`,
        `I see where you're coming from about ${mainTopic || "that"}. In similar situations, I've found it helpful to consider different approaches.`,
        `What you're saying about ${mainTopic || "this"} resonates with me. Have you always felt this way about it?`,
        `I'm curious about your thoughts on ${mainTopic || "this"}. What led you to that conclusion?`
      ];
      response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }
    
    return new Response(JSON.stringify({ response }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });
  } catch (error) {
    console.error("Error in generate-conversation-response function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
