
import React from "react";
import { Challenge } from "@/types/social-strategies";

interface StrategyChallengesProps {
  challenges: Challenge[];
}

const StrategyChallenges = ({ challenges }: StrategyChallengesProps) => {
  return (
    <div className="space-y-2">
      <h4 className="font-medium">Potential challenges</h4>
      <div className="space-y-2">
        {challenges.map((challenge, index) => (
          <div key={index} className="bg-muted p-3 rounded-md">
            <p className="text-sm font-medium mb-1">{challenge.challenge}</p>
            <p className="text-sm text-muted-foreground">{challenge.solution}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrategyChallenges;
