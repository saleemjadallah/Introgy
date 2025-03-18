
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search, ArrowRight } from "lucide-react";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // FAQ categories and items
  const faqCategories = [
    {
      id: "getting-started",
      title: "Getting Started with Introgy",
      items: [
        {
          question: "What is Introgy?",
          answer: "Introgy is an app designed specifically for introverts to help manage social energy, navigate social situations, build meaningful connections, and embrace your introverted nature. It offers tools for tracking your social battery, preparing for social events, and learning strategies that work well for introverts."
        },
        {
          question: "What is a Social Battery and how does tracking work?",
          answer: "Your social battery represents your mental and emotional energy for social interactions. Introgy helps you track this energy throughout the day as different activities drain or recharge it. You can log activities and see patterns over time to better manage your social energy and avoid burnout."
        },
        {
          question: "How can I customize my introvert profile?",
          answer: "After creating an account, you can customize your introvert profile by visiting the Profile section and updating your introvert level, energy drains and gains, communication preferences, and social goals. This information helps personalize the app experience to your specific introvert traits."
        },
        {
          question: "Is my data shared with others on the platform?",
          answer: "No, Introgy is focused on personal insight rather than social networking. Your data is private by default and not shared with other users. You have complete control over what information is stored in your profile and can export or delete it at any time."
        }
      ]
    },
    {
      id: "account-privacy",
      title: "Account & Privacy",
      items: [
        {
          question: "How is my personal information protected?",
          answer: "Introgy takes your privacy seriously. We use encryption for all sensitive data, don't share your information with third parties, and give you complete control over what data is stored. You can export or delete your data at any time from the Privacy & Data settings in your profile."
        },
        {
          question: "Can I use Introgy without creating an account?",
          answer: "Yes, you can use basic features without an account. However, creating an account allows us to save your preferences, history, and personalized settings across devices. Your data remains private and secure."
        },
        {
          question: "How do I control what data is stored about me?",
          answer: "In your Profile section under Privacy & Data, you can view and control all data collection settings. You can toggle features like usage analytics, export your data for personal records, or completely delete your account and associated data."
        },
        {
          question: "How do I delete my account?",
          answer: "To delete your account, go to your Profile, select Settings, then Privacy & Data, and use the Delete Account button. You'll have the option to download your data first. Account deletion is permanent and will remove all your data from our servers."
        }
      ]
    },
    {
      id: "features",
      title: "App Features",
      items: [
        {
          question: "How do I prepare for an upcoming social event?",
          answer: "Navigate to the Social Navigation section and use the Event Preparation tool. You can create an event, estimate its energy cost, set up boundaries, prepare conversation topics, and create exit strategies. The app will also suggest personalized tips based on your introvert profile."
        },
        {
          question: "Can I practice conversations before important meetings?",
          answer: "Yes, the Conversation Simulator in the Social Navigation section allows you to practice different conversation scenarios. Choose a scenario type, practice responses, and receive feedback. This feature helps build confidence for real-world interactions."
        },
        {
          question: "How do I track my social energy throughout the day?",
          answer: "The Social Battery tracker lets you log activities that drain or recharge your energy. You can add custom activities, rate their impact, and view patterns over time. The app will also suggest recharge activities when your battery is running low."
        },
        {
          question: "What are badges and how do I earn them?",
          answer: "Badges are achievements that recognize your progress and growth as an introvert. They're earned through app engagement like completing assessments, trying new strategies, or successfully managing your social energy. View your badges in the Profile section."
        }
      ]
    },
    {
      id: "technical",
      title: "Technical Support",
      items: [
        {
          question: "How do I update the app?",
          answer: "Introgy updates automatically through your device's app store. Ensure you have automatic updates enabled or periodically check for updates in your app store. Important new features are highlighted when you open the app after an update."
        },
        {
          question: "Can I access Introgy on multiple devices?",
          answer: "Yes, with an account you can access Introgy across multiple devices. Your data will synchronize automatically, allowing you to check your social battery or event preparations regardless of which device you're using."
        },
        {
          question: "The app is crashing or not working properly, what should I do?",
          answer: "First, try restarting the app. If issues persist, ensure your app is updated to the latest version. You can also try clearing the app cache in your device settings. If problems continue, contact support through the Help section with details about the issue."
        },
        {
          question: "How do I report a bug or request a feature?",
          answer: "In your Profile section, navigate to Help & FAQ and use the 'Contact Support' button. For bug reports, include steps to reproduce the issue and your device information. Feature requests are reviewed by our team regularly as we continue improving Introgy."
        }
      ]
    }
  ];
  
  // Filter FAQ items based on search query
  const filterFAQs = () => {
    if (!searchQuery.trim()) return faqCategories;
    
    const query = searchQuery.toLowerCase();
    return faqCategories.map(category => {
      const filteredItems = category.items.filter(item => 
        item.question.toLowerCase().includes(query) || 
        item.answer.toLowerCase().includes(query)
      );
      
      return { ...category, items: filteredItems };
    }).filter(category => category.items.length > 0);
  };
  
  const filteredCategories = filterFAQs();
  
  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">
          Find answers to common questions about using Introgy
        </p>
      </div>
      
      {/* Search bar */}
      <div className="relative mb-8">
        <Input
          type="text"
          placeholder="Search for questions or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      
      {/* FAQ categories */}
      <div className="space-y-8">
        {filteredCategories.map((category) => (
          <div key={category.id} className="space-y-4">
            <h2 className="text-xl font-medium">{category.title}</h2>
            
            {category.items.length > 0 ? (
              <div className="space-y-3">
                {category.items.map((item, index) => (
                  <Collapsible key={index} className="border rounded-lg">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left font-medium">
                      <span className="pr-8">{item.question}</span>
                      <ChevronDown size={18} className="transition-transform duration-200 ui-open:rotate-180 flex-shrink-0" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 pt-0 text-muted-foreground border-t">
                      {item.answer}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                No matching questions found in this category.
              </p>
            )}
          </div>
        ))}
        
        {filteredCategories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">
              No questions found matching "{searchQuery}"
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
          </div>
        )}
      </div>
      
      {/* Contact support section */}
      <div className="mt-12 border rounded-lg p-6 bg-primary/5">
        <h2 className="text-xl font-medium mb-2">Need more help?</h2>
        <p className="text-muted-foreground mb-4">
          If you couldn't find the answer to your question, our support team is here to help.
        </p>
        <Button>
          Contact Support
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default FAQ;
