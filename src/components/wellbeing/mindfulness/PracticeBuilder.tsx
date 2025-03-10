
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PracticeForm from "./builder/PracticeForm";
import GeneratedPracticeView from "./builder/GeneratedPracticeView";
import { usePracticeBuilder } from "./builder/usePracticeBuilder";

const PracticeBuilder = () => {
  const {
    practiceRequest,
    isAdvancedOpen,
    setIsAdvancedOpen,
    isGenerating,
    generatedPractice,
    handleFocusAreaToggle,
    handleTechniqueToggle,
    handleGenerate,
    resetForm,
    updateDuration,
    updateSituationType,
    updateSituationDetails,
    updateGoalStatement
  } = usePracticeBuilder();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Intelligent Practice Builder</CardTitle>
          <CardDescription>
            Create a personalized mindfulness practice tailored to your needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!generatedPractice ? (
            <PracticeForm 
              practiceRequest={practiceRequest}
              isAdvancedOpen={isAdvancedOpen}
              setIsAdvancedOpen={setIsAdvancedOpen}
              isGenerating={isGenerating}
              handleFocusAreaToggle={handleFocusAreaToggle}
              handleTechniqueToggle={handleTechniqueToggle}
              handleGenerate={handleGenerate}
              updateDuration={updateDuration}
              updateSituationType={updateSituationType}
              updateSituationDetails={updateSituationDetails}
              updateGoalStatement={updateGoalStatement}
            />
          ) : (
            <GeneratedPracticeView 
              practice={generatedPractice}
              onCreateAnother={resetForm}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {generatedPractice ? (
            <>
              <Button 
                variant="outline" 
                onClick={resetForm}
              >
                Create Another
              </Button>
              <Button>
                Save to My Practices
              </Button>
            </>
          ) : (
            <div className="text-xs text-muted-foreground italic w-full text-center">
              Your practice will be customized based on your selections and learning from past preferences
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PracticeBuilder;
