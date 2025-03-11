
import { Database } from "@/integrations/supabase/types";
import { 
  Relationship, 
  RelationshipInsight, 
  RelationshipHealth,
  ConnectionSuggestion,
  IntelligentConversationStarter,
  MessageTemplate,
  InteractionType
} from "@/types/relationship-nurturing";

type DbRelationship = Database["public"]["Tables"]["relationships"]["Row"];
type DbInsight = Database["public"]["Tables"]["relationship_insights"]["Row"];
type DbHealth = Database["public"]["Tables"]["relationship_health"]["Row"];
type DbSuggestion = Database["public"]["Tables"]["connection_suggestions"]["Row"];
type DbStarter = Database["public"]["Tables"]["intelligent_conversation_starters"]["Row"];
type DbTemplate = Database["public"]["Tables"]["message_templates"]["Row"];

export const convertDbRelationship = (dbRelationship: DbRelationship): Relationship => ({
  id: dbRelationship.id,
  name: dbRelationship.name,
  category: dbRelationship.category,
  importance: dbRelationship.importance_level || 1,
  notes: "",
  contactMethods: [],
  interests: [],
  lifeEvents: [],
  conversationTopics: [],
  interactionHistory: []
});

export const convertDbInsight = (dbInsight: DbInsight): RelationshipInsight => ({
  id: dbInsight.id,
  relationshipId: dbInsight.relationship_id || "",
  relationshipName: dbInsight.relationship_name,
  title: dbInsight.title,
  description: dbInsight.description,
  recommendation: dbInsight.recommendation,
  type: dbInsight.type,
  severity: dbInsight.severity,
  dateGenerated: dbInsight.date_generated,
  isNew: dbInsight.is_new
});

export const convertDbHealth = async (
  dbHealth: DbHealth, 
  supabase: any
): Promise<RelationshipHealth> => {
  // Fetch suggestions for this health assessment
  const { data: suggestionData } = await supabase
    .from('relationship_health_suggestions')
    .select('suggestion')
    .eq('health_id', dbHealth.id);

  const suggestions = suggestionData?.map(s => s.suggestion) || [];

  return {
    relationshipId: dbHealth.relationship_id || "",
    relationshipName: dbHealth.relationship_name,
    overallScore: dbHealth.overall_score,
    frequency: dbHealth.frequency,
    quality: dbHealth.quality,
    reciprocity: dbHealth.reciprocity,
    trend: dbHealth.trend,
    lastAssessment: dbHealth.last_assessment,
    suggestions
  };
};

export const convertDbSuggestion = (dbSuggestion: DbSuggestion): ConnectionSuggestion => ({
  id: dbSuggestion.id,
  relationshipId: dbSuggestion.relationship_id || "",
  relationshipName: dbSuggestion.relationship_name,
  suggested: dbSuggestion.suggested,
  suggestedDate: dbSuggestion.suggested_date,
  suggestedTime: dbSuggestion.suggested_time,
  interactionType: dbSuggestion.interaction_type as InteractionType,
  reasonForSuggestion: dbSuggestion.reason_for_suggestion || "",
  energyLevelRequired: dbSuggestion.energy_level_required,
  priority: Number(dbSuggestion.priority),
  expectedResponse: dbSuggestion.expected_response
});

export const convertDbStarter = (dbStarter: DbStarter): IntelligentConversationStarter => ({
  id: dbStarter.id,
  relationshipId: dbStarter.relationship_id || "",
  topic: dbStarter.topic,
  starter: dbStarter.starter,
  context: dbStarter.context || "",
  confidenceScore: dbStarter.confidence_score || 0,
  source: dbStarter.source
});

export const convertDbTemplate = (dbTemplate: DbTemplate): MessageTemplate => ({
  id: dbTemplate.id,
  name: dbTemplate.name,
  category: dbTemplate.category,
  context: dbTemplate.context,
  template: dbTemplate.template,
  personalizable: dbTemplate.personalizable,
  tone: dbTemplate.tone,
  energyRequired: dbTemplate.energy_required,
  title: dbTemplate.name,
  body: dbTemplate.template,
  appropriate_for: [dbTemplate.category]
});
