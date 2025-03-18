
// Relationship insight type
export interface RelationshipInsight {
  id: string;
  relationshipId: string;
  relationshipName: string;
  title: string;
  description: string;
  recommendation: string;
  type: 'connection_gap' | 'interaction_pattern' | 'energy_impact' | 'conversation_suggestion' | 'relationship_health' | 'other';
  severity: 'low' | 'medium' | 'high';
  dateGenerated: string;
  isNew: boolean;
}

// Relationship health assessment
export interface RelationshipHealth {
  relationshipId: string;
  relationshipName: string;
  overallScore: number;        // 0-100 
  frequency: number;           // 0-100
  quality: number;             // 0-100
  reciprocity: number;         // 0-100
  trend: 'improving' | 'declining' | 'stable';
  lastAssessment: string;      // Date
  suggestions: string[];
}
