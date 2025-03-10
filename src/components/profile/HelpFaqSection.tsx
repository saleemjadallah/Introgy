
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const HelpFaqSection = () => {
  const faqItems = [
    {
      question: "What is a Social Battery and how does tracking work?",
      answer: "Your social battery represents your mental and emotional energy for social interactions. The app helps you track this energy throughout the day as different activities drain or recharge it. You can log activities and see patterns over time to better manage your social energy."
    },
    {
      question: "How is my personal information protected?",
      answer: "InnerCircle takes your privacy seriously. We use encryption for all sensitive data, don't share your information with third parties, and give you complete control over what data is stored. You can export or delete your data at any time from the Privacy & Data settings."
    },
    {
      question: "How do I prepare for an upcoming social event?",
      answer: "Navigate to the Social Navigation section and use the Event Preparation tool. You can create an event, estimate its energy cost, set up boundaries, prepare conversation topics, and create exit strategies. The app will also suggest personalized tips based on your introvert profile."
    },
    {
      question: "Can I use InnerCircle without creating an account?",
      answer: "Yes, you can use basic features without an account. However, creating an account allows us to save your preferences, history, and personalized settings across devices. Your data remains private and secure."
    },
    {
      question: "What are badges and how do I earn them?",
      answer: "Badges are achievements that recognize your personal growth journey as an introvert. You earn them by using app features, developing your social skills, managing your energy, and reaching important milestones. Each badge has specific criteria, and you can track your progress in the Badges section of your profile."
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <CardDescription>
          Find answers to common questions about using InnerCircle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {faqItems.map((item, index) => (
          <Collapsible key={index} className="border rounded-lg">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left font-medium">
              {item.question}
              <ChevronDown size={18} className="transition-transform duration-200 ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 text-sm text-muted-foreground border-t">
              {item.answer}
            </CollapsibleContent>
          </Collapsible>
        ))}
        
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground mb-3">
            Can't find what you're looking for?
          </p>
          <Button variant="outline">Contact Support</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HelpFaqSection;
