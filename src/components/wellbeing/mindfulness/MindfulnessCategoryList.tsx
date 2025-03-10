import { useState } from "react";
import { 
  Heart, 
  Battery, 
  Shield, 
  Clock, 
  Focus, 
  ChevronsUpDown, 
  SearchIcon 
} from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { MindfulnessCategory } from "@/types/mindfulness";
import { getPractices } from "@/data/mindfulness";

interface MindfulnessCategoryListProps {
  onSelectPractice: (id: string) => void;
  selectedPracticeId?: string;
}

const MindfulnessCategoryList = ({ onSelectPractice, selectedPracticeId }: MindfulnessCategoryListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const categories: {
    name: MindfulnessCategory;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      name: "Social Recovery",
      icon: <Heart size={18} />,
      description: "Practices to recharge after social interactions"
    },
    {
      name: "Energy Conservation",
      icon: <Battery size={18} />,
      description: "Techniques to protect and maintain your energy"
    },
    {
      name: "Quiet Strength",
      icon: <Shield size={18} />,
      description: "Build confidence in your introvert strengths"
    },
    {
      name: "Preparation",
      icon: <Clock size={18} />,
      description: "Center yourself before social events"
    },
    {
      name: "Deep Focus",
      icon: <Focus size={18} />,
      description: "Enhance concentration and mental clarity"
    }
  ];
  
  const getCategoryPractices = (category: MindfulnessCategory) => {
    return getPractices({ category }).filter(practice => 
      searchQuery === "" || 
      practice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      practice.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };
  
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center relative mb-4">
        <SearchIcon className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
        <Input
          placeholder="Search practices..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Accordion type="multiple" defaultValue={["Social Recovery"]} className="w-full">
        {categories.map((category) => {
          const practices = getCategoryPractices(category.name);
          
          // Skip empty categories when filtering
          if (searchQuery && practices.length === 0) return null;
          
          return (
            <AccordionItem value={category.name} key={category.name}>
              <AccordionTrigger className="hover:no-underline hover:bg-accent/50 rounded-md px-2">
                <div className="flex items-center gap-2">
                  {category.icon}
                  <span>{category.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {category.description}
                </p>
                <div className="space-y-1 mt-3">
                  {practices.map((practice) => (
                    <div
                      key={practice.id}
                      className={`px-2 py-1.5 rounded-md cursor-pointer text-sm transition-colors ${
                        selectedPracticeId === practice.id 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-accent"
                      }`}
                      onClick={() => onSelectPractice(practice.id)}
                    >
                      <div className="font-medium">{practice.title}</div>
                      <div className="text-xs opacity-80">{practice.duration} min • {practice.subcategory}</div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default MindfulnessCategoryList;
