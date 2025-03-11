import { useState } from 'react';
import { useMeaningfulInteractions } from '@/hooks/useMeaningfulInteractions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Heart, MessageCircle, Zap, Calendar, Timer, Clock, 
  ArrowRight, BookOpen, Send, Save, Plus, LinkIcon, 
  Search, Filter, Share2, RotateCcw, Check, Bookmark, 
  ExternalLink, Copy, Edit, RefreshCw
} from "lucide-react";
import { 
  relationshipTypes, 
  questionCategories, 
  messagePurposes, 
  experienceCategories, 
  depthLevelDescriptions 
} from '@/data/meaningfulInteractionsData';
import { DeepQuestion, SharedExperience, ConnectionRitual, MessageTemplate } from '@/types/meaningful-interactions';
import { useIsMobile } from '@/hooks/use-mobile';

// Main component for the Meaningful Interaction Tools feature
const MeaningfulInteractionTools = () => {
  const [activeTab, setActiveTab] = useState('questions');
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">Meaningful Interaction Tools</h2>
        <p className="text-muted-foreground">
          AI-powered tools to help you build deeper connections while preserving your social energy
        </p>
      </div>
      
      <Tabs defaultValue="questions" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4 overflow-x-auto">
          <TabsTrigger value="questions" className="px-1 sm:px-3">
            <span className="hidden sm:inline">Deep Questions</span>
            <span className="sm:hidden">
              <MessageCircle className="h-4 w-4" />
            </span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="px-1 sm:px-3">
            <span className="hidden sm:inline">Message Generator</span>
            <span className="sm:hidden">
              <Send className="h-4 w-4" />
            </span>
          </TabsTrigger>
          <TabsTrigger value="rituals" className="px-1 sm:px-3">
            <span className="hidden sm:inline">Connection Rituals</span>
            <span className="sm:hidden">
              <RefreshCw className="h-4 w-4" />
            </span>
          </TabsTrigger>
          <TabsTrigger value="experiences" className="px-1 sm:px-3">
            <span className="hidden sm:inline">Shared Experiences</span>
            <span className="sm:hidden">
              <Share2 className="h-4 w-4" />
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="questions" className="space-y-4">
          <DeepQuestionsTab />
        </TabsContent>
        
        <TabsContent value="messages" className="space-y-4">
          <MessageGeneratorTab />
        </TabsContent>
        
        <TabsContent value="rituals" className="space-y-4">
          <ConnectionRitualsTab />
        </TabsContent>
        
        <TabsContent value="experiences" className="space-y-4">
          <SharedExperiencesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Component for Deep Questions tab
const DeepQuestionsTab = () => {
  const {
    questions,
    questionFilters,
    setQuestionFilters,
    savedQuestions,
    saveQuestion,
    generatePersonalizedQuestions,
    isLoading
  } = useMeaningfulInteractions();
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDepthLevels, setSelectedDepthLevels] = useState<number[]>([]);
  const [selectedRelationshipTypes, setSelectedRelationshipTypes] = useState<string[]>([]);
  const [personalizedQuestions, setPersonalizedQuestions] = useState<DeepQuestion[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  
  // Apply filters
  const applyFilters = () => {
    setQuestionFilters({
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      depthLevels: selectedDepthLevels.length > 0 ? selectedDepthLevels : undefined,
      relationshipTypes: selectedRelationshipTypes.length > 0 ? selectedRelationshipTypes : undefined,
      searchTerm: searchTerm || undefined
    });
  };
  
  // Reset filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedDepthLevels([]);
    setSelectedRelationshipTypes([]);
    setSearchTerm('');
    setQuestionFilters({});
  };
  
  // Generate personalized questions
  const handleGenerateQuestions = () => {
    if (selectedRelationshipTypes.length === 0) {
      return;
    }
    
    const generatedQuestions = generatePersonalizedQuestions(
      selectedRelationshipTypes[0],
      [],
      selectedDepthLevels.length > 0 ? Math.max(...selectedDepthLevels) : 2,
      3
    );
    
    setPersonalizedQuestions(generatedQuestions);
  };
  
  // Filter toggle component
  const FiltersSection = () => (
    <div className={`space-y-4 rounded-lg border p-4 ${showFilters ? 'block' : 'hidden'}`}>
      <div className="space-y-2">
        <Label>Categories</Label>
        <div className="flex flex-wrap gap-2">
          {questionCategories.map(category => (
            <Badge 
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                setSelectedCategories(prev => 
                  prev.includes(category) 
                    ? prev.filter(c => c !== category) 
                    : [...prev, category]
                );
              }}
            >
              {category.replace('-', ' ')}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Depth Level</Label>
        <div className="flex flex-wrap gap-2">
          {depthLevelDescriptions.map(({level, label}) => (
            <Badge 
              key={level}
              variant={selectedDepthLevels.includes(level) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                setSelectedDepthLevels(prev => 
                  prev.includes(level) 
                    ? prev.filter(l => l !== level) 
                    : [...prev, level]
                );
              }}
            >
              {label}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Relationship Types</Label>
        <div className="flex flex-wrap gap-2">
          {relationshipTypes.map(type => (
            <Badge 
              key={type}
              variant={selectedRelationshipTypes.includes(type) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                setSelectedRelationshipTypes(prev => 
                  prev.includes(type) 
                    ? prev.filter(t => t !== type) 
                    : [...prev, type]
                );
              }}
            >
              {type.replace('-', ' ')}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Reset
        </Button>
        <Button size="sm" onClick={applyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
  
  // Question card component
  const QuestionCard = ({ question }: { question: DeepQuestion }) => (
    <Card>
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex space-x-2 items-center">
              <Badge variant="outline">
                {question.category.replace('-', ' ')}
              </Badge>
              <Badge 
                variant="secondary" 
                className="flex items-center gap-1"
              >
                <Zap className="h-3 w-3" />
                Energy: {question.energyRequired}/5
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Depth Level: {depthLevelDescriptions.find(d => d.level === question.depthLevel)?.label || question.depthLevel}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 px-3 sm:px-6">
        <p className="text-sm sm:text-base font-medium">{question.text}</p>
        
        {question.followUps.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs font-medium mb-1">Follow-up questions:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              {question.followUps.map((followUp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>{followUp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 px-3 sm:px-6 flex justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => saveQuestion(question)}
          disabled={savedQuestions.some(q => q.id === question.id)}
          className="flex items-center gap-1"
        >
          <Bookmark className="h-3 w-3" /> 
          {savedQuestions.some(q => q.id === question.id) ? 'Saved' : 'Save'}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 ml-2"
          onClick={() => {
            navigator.clipboard.writeText(question.text);
          }}
        >
          <Copy className="h-3 w-3" /> Copy
        </Button>
      </CardFooter>
    </Card>
  );
  
  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
          <div className="flex-1 sm:mr-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    applyFilters();
                  }
                }}
              />
            </div>
          </div>
          <div className="flex gap-2 sm:w-auto">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowSaved(!showSaved)}
              className="flex items-center gap-1"
            >
              <Bookmark className="h-4 w-4" /> 
              {showSaved ? 'Show All' : 'Saved'}
            </Button>
          </div>
        </div>
        
        <FiltersSection />
        
        <div className="flex justify-between items-center">
          <Button 
            onClick={handleGenerateQuestions}
            disabled={selectedRelationshipTypes.length === 0 || isLoading}
            className="flex items-center gap-1"
          >
            <MessageCircle className="h-4 w-4" /> 
            Generate Personalized Questions
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {!showSaved ? 
              `${questions.length} questions` : 
              `${savedQuestions.length} saved questions`}
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="space-y-2 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted-foreground">Generating questions...</p>
          </div>
        </div>
      ) : personalizedQuestions.length > 0 ? (
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-medium">Personalized Questions</h3>
          <div className="space-y-4">
            {personalizedQuestions.map(question => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPersonalizedQuestions([])}
              className="flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" /> Clear Generated Questions
            </Button>
          </div>
          
          <Separator className="my-4" />
        </div>
      ) : null}
      
      <div className="space-y-4">
        {showSaved ? (
          savedQuestions.length > 0 ? (
            <div className="space-y-4">
              {savedQuestions.map(question => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You haven't saved any questions yet.</p>
            </div>
          )
        ) : (
          questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map(question => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No questions match your filters.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

// Component for Message Generator tab
const MessageGeneratorTab = () => {
  const {
    messageTemplates,
    fillMessageTemplate,
    createCustomTemplate,
    isLoading
  } = useMeaningfulInteractions();
  
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [purposeFilter, setPurposeFilter] = useState<string>('');
  const [stageFilter, setStageFilter] = useState<string>('');
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  
  // Handle template selection
  const handleSelectTemplate = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    
    // Initialize variables object
    const variables: Record<string, string> = {};
    template.variables.forEach(variable => {
      variables[variable.name] = variable.type === 'selection' && variable.options 
        ? variable.options[0]
        : '';
    });
    
    setTemplateVariables(variables);
    setGeneratedMessage('');
  };
  
  // Handle variable change
  const handleVariableChange = (name: string, value: string) => {
    setTemplateVariables(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Generate message
  const handleGenerateMessage = () => {
    if (!selectedTemplate) return;
    
    // Check if all variables are filled
    const allFilled = selectedTemplate.variables.every(v => 
      templateVariables[v.name] && templateVariables[v.name].trim() !== ''
    );
    
    if (!allFilled) {
      return;
    }
    
    const message = fillMessageTemplate(selectedTemplate, templateVariables);
    setGeneratedMessage(message);
  };
  
  // Message template card
  const TemplateCard = ({ template }: { template: MessageTemplate }) => (
    <Card 
      className={`hover:border-primary/50 cursor-pointer transition-colors ${
        selectedTemplate?.id === template.id ? 'border-primary' : ''
      }`}
      onClick={() => handleSelectTemplate(template)}
    >
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-1">
              {template.purpose.replace('-', ' ')}
            </Badge>
            <CardTitle className="text-sm sm:text-base">
              {template.tone.charAt(0).toUpperCase() + template.tone.slice(1)} Tone
            </CardTitle>
            <CardDescription className="text-xs">
              For {template.relationshipStage.replace('-', ' ')} relationships • Energy: {template.energyRequired}/5
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 px-3 sm:px-6">
        <p className="text-xs sm:text-sm text-muted-foreground italic">
          {template.baseTemplate}
        </p>
        
        {template.variables.length > 0 && (
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs font-medium mb-1">Variables:</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
              {template.variables.map((variable) => (
                <div key={variable.name} className="flex items-center">
                  <Plus className="h-3 w-3 mr-1" />
                  <span>{variable.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
  
  // Filtered templates
  const filteredTemplates = messageTemplates.filter(template => {
    if (purposeFilter && template.purpose !== purposeFilter) {
      return false;
    }
    
    if (stageFilter && template.relationshipStage !== stageFilter) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="mb-4 space-y-3">
            <h3 className="text-lg font-medium">Select Message Template</h3>
            <div className="flex flex-wrap gap-2">
              <Select value={purposeFilter} onValueChange={setPurposeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Purposes</SelectItem>
                  {messagePurposes.map(purpose => (
                    <SelectItem key={purpose} value={purpose}>
                      {purpose.replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Relationship Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Stages</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="established">Established</SelectItem>
                  <SelectItem value="close">Close</SelectItem>
                  <SelectItem value="reconnecting">Reconnecting</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No templates match your filters.</p>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">
              {selectedTemplate ? 'Customize Message' : 'Select a template to get started'}
            </h3>
            
            {selectedTemplate && (
              <div className="space-y-3">
                {selectedTemplate.variables.map(variable => (
                  <div key={variable.name} className="space-y-1">
                    <Label className="text-sm capitalize">
                      {variable.name.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                    </Label>
                    
                    {variable.type === 'selection' && variable.options ? (
                      <Select 
                        value={templateVariables[variable.name] || ''} 
                        onValueChange={(value) => handleVariableChange(variable.name, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${variable.name}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {variable.options.map(option => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        placeholder={`Enter ${variable.name}`}
                        value={templateVariables[variable.name] || ''}
                        onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                      />
                    )}
                  </div>
                ))}
                
                <Button 
                  className="w-full mt-4" 
                  onClick={handleGenerateMessage}
                  disabled={isLoading || !selectedTemplate.variables.every(v => 
                    templateVariables[v.name] && templateVariables[v.name].trim() !== ''
                  )}
                >
                  Generate Message
                </Button>
              </div>
            )}
          </div>
          
          {generatedMessage && (
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-medium">Generated Message</h3>
              <Card>
                <CardContent className="p-4">
                  <p className="whitespace-pre-wrap text-sm">{generatedMessage}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 px-4 pb-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedMessage);
                    }}
                  >
                    <Copy className="h-3 w-3" /> Copy
                  </Button>
                  <Button 
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Send className="h-3 w-3" /> Use Message
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component for Connection Rituals tab
const ConnectionRitualsTab = () => {
  const {
    rituals,
    activeRituals,
    adoptRitual,
    trackRitualCompletion,
    isLoading
  } = useMeaningfulInteractions();
  
  const [showActive, setShowActive] = useState(false);
  const [selectedRitual, setSelectedRitual] = useState<ConnectionRitual | null>(null);
  const [interactionTypeFilter, setInteractionTypeFilter] = useState<string>('');
  const [frequencyFilter, setFrequencyFilter] = useState<string>('');
  
  // Ritual card component
  const RitualCard = ({ ritual, isActive = false }: { ritual: ConnectionRitual, isActive?: boolean }) => (
    <Card 
      className={`hover:border-primary/50 cursor-pointer transition-colors ${
        selectedRitual?.id === ritual.id ? 'border-primary' : ''
      }`}
      onClick={() => setSelectedRitual(ritual)}
    >
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Badge variant="outline">
                {ritual.interactionType}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Timer className="h-3 w-3" />
                {ritual.duration} min
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Energy: {ritual.energyCost}/5
              </Badge>
              {isActive && (
                <Badge variant="default" className="bg-green-500 text-white">
                  Active
                </Badge>
              )}
            </div>
            <CardTitle className="text-sm sm:text-base">{ritual.name}</CardTitle>
            <CardDescription className="text-xs flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Every {ritual.frequency.value} {ritual.frequency.unit}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 px-3 sm:px-6">
        <p className="text-xs sm:text-sm">{ritual.description}</p>
      </CardContent>
    </Card>
  );
  
  // Filtered rituals
  const filteredRituals = (showActive ? activeRituals : rituals).filter(ritual => {
    if (interactionTypeFilter && ritual.interactionType !== interactionTypeFilter) {
      return false;
    }
    
    if (frequencyFilter) {
      const [value, unit] = frequencyFilter.split('-');
      if (ritual.frequency.unit !== unit || ritual.frequency.value !== parseInt(value)) {
        return false;
      }
    }
    
    return true;
  });
  
  // Frequency options
  const frequencyOptions = [
    { label: 'Weekly', value: '1-weeks' },
    { label: 'Bi-weekly', value: '2-weeks' },
    { label: 'Monthly', value: '1-months' },
    { label: 'Quarterly', value: '3-months' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="mb-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {showActive ? 'Your Active Rituals' : 'Browse Connection Rituals'}
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowActive(!showActive)}
                className="flex items-center gap-1"
              >
                {showActive ? 'Browse All' : 'Show Active'}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={interactionTypeFilter} onValueChange={setInteractionTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Interaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="message">Message</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="in-person">In-person</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Frequencies</SelectItem>
                  {frequencyOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredRituals.length > 0 ? (
              filteredRituals.map(ritual => (
                <RitualCard 
                  key={ritual.id} 
                  ritual={ritual} 
                  isActive={activeRituals.some(r => r.id === ritual.id)}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {showActive 
                    ? "You don't have any active rituals yet." 
                    : "No rituals match your filters."}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div>
          {selectedRitual ? (
            <Card>
              <CardHeader className="px-4 sm:px-6">
                <CardTitle>{selectedRitual.name}</CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="outline">
                    {selectedRitual.interactionType}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Timer className="h-3 w-3" />
                    {selectedRitual.duration} min
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Every {selectedRitual.frequency.value} {selectedRitual.frequency.unit}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-2">
                <p className="text-sm mb-4">{selectedRitual.description}</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Structure:</h4>
                    <p className="text-sm text-muted-foreground">{selectedRitual.structure}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Conversation Prompts:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {selectedRitual.prompts.map((prompt, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{prompt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Best for:</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedRitual.relationshipTypes.map(type => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type.replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 sm:px-6 pt-4 flex flex-wrap justify-end gap-2">
                {activeRituals.some(r => r.id === selectedRitual.id) ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => trackRitualCompletion(selectedRitual.id)}
                      className="flex items-center gap-1"
                    >
                      <Check className="h-4 w-4" /> Log Completion
                    </Button>
                    <Button disabled>
                      Already Active
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => adoptRitual(selectedRitual)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add to My Rituals
                  </Button>
                )}
              </CardFooter>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
              <MessageCircle className="h-12 w-12 text-muted-foreground/30 mb-2" />
              <h3 className="text-lg font-medium">Select a Ritual</h3>
              <p className="text-muted-foreground mt-1 max-w-md">
                Choose a connection ritual from the list to view details and add it to your active rituals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component for Shared Experiences tab
const SharedExperiencesTab = () => {
  const {
    experiences,
    sharedExperiences,
    saveSharedExperience,
    getExperienceRecommendations,
    isLoading
  } = useMeaningfulInteractions();
  
  const [showSaved, setShowSaved] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<SharedExperience | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [energyFilter, setEnergyFilter] = useState<number | null>(null);
  const [timeFilter, setTimeFilter] = useState<number | null>(null);
  const [recommendedExperiences, setRecommendedExperiences] = useState<SharedExperience[]>([]);
  
  // Get experience recommendations
  const handleGetRecommendations = () => {
    // Default to "friend" if no relationship type is selected
    const recommendations = getExperienceRecommendations(
      'friend',
      energyFilter || 3,
      timeFilter || 60,
      3
    );
    
    setRecommendedExperiences(recommendations);
  };
  
  // Experience card component
  const ExperienceCard = ({ experience, isSaved = false }: { experience: SharedExperience, isSaved?: boolean }) => (
    <Card 
      className={`hover:border-primary/50 cursor-pointer transition-colors ${
        selectedExperience?.id === experience.id ? 'border-primary' : ''
      }`}
      onClick={() => setSelectedExperience(experience)}
    >
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Badge variant="outline">
                {experience.category}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {experience.timeRequired} min
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Energy: {experience.energyRequired}/5
              </Badge>
              {isSaved && (
                <Badge variant="default" className="bg-blue-500 text-white">
                  Saved
                </Badge>
              )}
            </div>
            <CardTitle className="text-sm sm:text-base">{experience.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 px-3 sm:px-6">
        <p className="text-xs sm:text-sm text-muted-foreground">{experience.description}</p>
        
        {experience.interestTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {experience.interestTags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
  
  // Filtered experiences
  const filteredExperiences = (showSaved ? sharedExperiences : experiences).filter(experience => {
    if (categoryFilter && experience.category !== categoryFilter) {
      return false;
    }
    
    if (energyFilter !== null && experience.energyRequired > energyFilter) {
      return false;
    }
    
    if (timeFilter !== null && experience.timeRequired > timeFilter) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="mb-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {showSaved ? 'Your Saved Experiences' : 'Browse Shared Experiences'}
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSaved(!showSaved)}
                className="flex items-center gap-1"
              >
                {showSaved ? 'Browse All' : 'Show Saved'}
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {experienceCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">Maximum Energy Required: {energyFilter || 'Any'}</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setEnergyFilter(null)}
                    className="h-6 text-xs"
                  >
                    Reset
                  </Button>
                </div>
                <Slider 
                  value={energyFilter !== null ? [energyFilter] : [5]} 
                  min={1} 
                  max={5} 
                  step={1} 
                  onValueChange={(value) => setEnergyFilter(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">Maximum Time (minutes): {timeFilter || 'Any'}</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setTimeFilter(null)}
                    className="h-6 text-xs"
                  >
                    Reset
                  </Button>
                </div>
                <Slider 
                  value={timeFilter !== null ? [timeFilter] : [120]} 
                  min={15} 
                  max={120} 
                  step={15} 
                  onValueChange={(value) => setTimeFilter(value[0])}
                />
              </div>
              
              <Button
                onClick={handleGetRecommendations}
                className="w-full flex items-center gap-1"
              >
                <Heart className="h-4 w-4" /> Get Personalized Recommendations
              </Button>
            </div>
          </div>
          
          {recommendedExperiences.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Recommended For You</h4>
              <div className="space-y-3">
                {recommendedExperiences.map(experience => (
                  <ExperienceCard 
                    key={experience.id} 
                    experience={experience} 
                    isSaved={sharedExperiences.some(e => e.id === experience.id)}
                  />
                ))}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setRecommendedExperiences([])}
                className="mt-2"
              >
                Clear Recommendations
              </Button>
              <Separator className="my-4" />
            </div>
          )}
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredExperiences.length > 0 ? (
              filteredExperiences.map(experience => (
                <ExperienceCard 
                  key={experience.id} 
                  experience={experience} 
                  isSaved={sharedExperiences.some(e => e.id === experience.id)}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {showSaved 
                    ? "You don't have any saved experiences yet." 
                    : "No experiences match your filters."}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div>
          {selectedExperience ? (
            <Card>
              <CardHeader className="px-4 sm:px-6">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>{selectedExperience.title}</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge variant="outline">
                        {selectedExperience.category}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {selectedExperience.timeRequired} min
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Energy: {selectedExperience.energyRequired}/5
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-2">
                <p className="text-sm mb-4">{selectedExperience.description}</p>
                
                <div className="space-y-4">
                  {selectedExperience.url && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Resource Link:</h4>
                      <a 
                        href={selectedExperience.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Open Resource
                      </a>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Discussion Prompts:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {selectedExperience.discussionPrompts.map((prompt, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{prompt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Interest Tags:</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedExperience.interestTags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Best for:</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedExperience.relationshipTypes.map(type => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type.replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 sm:px-6 pt-4 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={() => {
                    if (selectedExperience.url) {
                      navigator.clipboard.writeText(selectedExperience.url);
                    }
                  }}
                  disabled={!selectedExperience.url}
                >
                  <Copy className="h-4 w-4" /> Copy Link
                </Button>
                {sharedExperiences.some(e => e.id === selectedExperience.id) ? (
                  <Button disabled>
                    Already Saved
                  </Button>
                ) : (
                  <Button 
                    onClick={() => saveSharedExperience(selectedExperience)}
                    className="flex items-center gap-1"
                  >
                    <Bookmark className="h-4 w-4" /> Save Experience
                  </Button>
                )}
              </CardFooter>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
              <Share2 className="h-12 w-12 text-muted-foreground/30 mb-2" />
              <h3 className="text-lg font-medium">Select an Experience</h3>
              <p className="text-muted-foreground mt-1 max-w-md">
                Choose a shared experience from the list to view details and save it to your collection.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeaningfulInteractionTools;