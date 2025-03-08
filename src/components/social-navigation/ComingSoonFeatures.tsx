
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import ConversationSimulator from "./ConversationSimulator";
import SocialStrategies from "./SocialStrategies";

const ComingSoonFeatures = () => {
  return (
    <div className="space-y-6">
      {/* Updated to include the SocialStrategies component */}
      <ConversationSimulator />
      <SocialStrategies />
    </div>
  );
};

export default ComingSoonFeatures;
