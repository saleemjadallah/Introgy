import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WisdomSubmissionForm from "./WisdomSubmissionForm";
import WisdomLibrary from "./WisdomLibrary";
import { WisdomItem } from "@/types/community-wisdom";
import { useToast } from "@/hooks/use-toast";
import { generateSeedWisdom } from "./wisdomSeedData";
import { usePremium } from "@/contexts/premium";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PremiumFeatureGuard } from "@/components/premium/PremiumFeatureGuard";

const CommunityWisdom = () => {
  const [wisdomItems, setWisdomItems] = useState<WisdomItem[]>(() => {
    // Load from localStorage or use seed data
    const savedWisdom = localStorage.getItem("communityWisdom");
    return savedWisdom ? JSON.parse(savedWisdom) : generateSeedWisdom();
  });
  
  const [savedItems, setSavedItems] = useState<string[]>(() => {
    const saved = localStorage.getItem("savedWisdomIds");
    return saved ? JSON.parse(saved) : [];
  });
  
  const { toast } = useToast();
  const { isPremium } = usePremium();
  const navigate = useNavigate();

  const handleSubmitWisdom = (newWisdom: WisdomItem) => {
    const updatedWisdom = [newWisdom, ...wisdomItems];
    setWisdomItems(updatedWisdom);
    localStorage.setItem("communityWisdom", JSON.stringify(updatedWisdom));
    
    toast({
      title: "Wisdom shared",
      description: "Your insight has been added to the community wisdom library.",
    });
  };

  const handleToggleSaveWisdom = (id: string) => {
    // Free users can only save 5 items
    if (!isPremium && !savedItems.includes(id) && savedItems.length >= 5) {
      toast({
        title: "Free plan limit reached",
        description: "Upgrade to premium to save unlimited wisdom items.",
      });
      return;
    }
    
    let updatedSavedItems;
    
    if (savedItems.includes(id)) {
      updatedSavedItems = savedItems.filter(itemId => itemId !== id);
      toast({
        title: "Removed from collection",
        description: "The wisdom item has been removed from your personal collection.",
      });
    } else {
      updatedSavedItems = [...savedItems, id];
      toast({
        title: "Added to collection",
        description: "The wisdom item has been saved to your personal collection.",
      });
    }
    
    setSavedItems(updatedSavedItems);
    localStorage.setItem("savedWisdomIds", JSON.stringify(updatedSavedItems));
  };

  const markWisdomAsHelpful = (id: string) => {
    const updatedWisdom = wisdomItems.map(item => 
      item.id === id ? { ...item, helpfulCount: item.helpfulCount + 1 } : item
    );
    
    setWisdomItems(updatedWisdom);
    localStorage.setItem("communityWisdom", JSON.stringify(updatedWisdom));
    
    toast({
      title: "Marked as helpful",
      description: "Thank you for your feedback!",
    });
  };

  // Free users can only save up to 5 items
  const showSavedLimitWarning = !isPremium && savedItems.length >= 5;

  return (
    <div className="space-y-6">
      {!isPremium && (
        <Alert className="bg-muted/50 border border-primary/20">
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>Free plan limits community wisdom access to 10 items and 5 saved items.</span>
            <Button 
              size="sm" 
              onClick={() => navigate("/profile?tab=pricing")}
              className="whitespace-nowrap"
            >
              <Star className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="contribute" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="contribute">Contribute</TabsTrigger>
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent value="contribute" className="space-y-4 mt-6">
          <WisdomSubmissionForm onSubmit={handleSubmitWisdom} />
        </TabsContent>
        <TabsContent value="browse" className="space-y-4 mt-6">
          <WisdomLibrary 
            wisdomItems={wisdomItems}
            savedItems={savedItems}
            onToggleSave={handleToggleSaveWisdom}
            onMarkHelpful={markWisdomAsHelpful}
            filterSaved={false}
          />
        </TabsContent>
        <TabsContent value="saved" className="space-y-4 mt-6">
          {showSavedLimitWarning && (
            <Alert className="mb-4">
              <AlertDescription>
                You've reached the maximum of 5 saved items in the free plan.
              </AlertDescription>
            </Alert>
          )}
          <WisdomLibrary 
            wisdomItems={wisdomItems}
            savedItems={savedItems}
            onToggleSave={handleToggleSaveWisdom}
            onMarkHelpful={markWisdomAsHelpful}
            filterSaved={true}
          />
        </TabsContent>
        <TabsContent value="about" className="space-y-4 mt-6">
          <div className="prose max-w-none dark:prose-invert">
            <h3>About Community Wisdom</h3>
            <p>
              Community Wisdom is a private, anonymous space where introverts can share and discover practical strategies, 
              personal insights, and experiences that have helped them navigate various social situations.
            </p>
            <h4>How it works</h4>
            <ul>
              <li><strong>Completely anonymous</strong> - All submissions are anonymous with no tracking or user identification.</li>
              <li><strong>Quality focused</strong> - We emphasize quality insights over quantity or popularity.</li>
              <li><strong>Supportive environment</strong> - This is a space for sharing what works, not criticizing or judging.</li>
              <li><strong>Personal collection</strong> - Save wisdom that resonates with you to your personal collection.</li>
            </ul>
            <h4>Community Guidelines</h4>
            <ul>
              <li>Share practical, specific advice rather than generalities.</li>
              <li>Be respectful and supportive of different introvert experiences.</li>
              <li>Focus on strategies that have actually worked for you.</li>
              <li>Avoid sharing personally identifying information.</li>
              <li>Keep submissions concise (under 1000 characters).</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityWisdom;
