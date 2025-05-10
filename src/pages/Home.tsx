
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LineChart, BookOpen, Users, Battery, MessageSquare } from "lucide-react";

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center space-y-6 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Introgy App Features</h1>
        <p className="text-xl text-muted-foreground">
          Explore the key features of our app designed for introverts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <Link to="/social-battery" className="no-underline">
          <div className="border rounded-lg p-6 h-full bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Battery className="h-6 w-6 text-green-500" />
              <h2 className="text-xl font-semibold">Social Battery</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Track your social energy levels and get personalized recharge recommendations
            </p>
            <Button variant="outline" className="mt-2">
              Learn More
            </Button>
          </div>
        </Link>

        <Link to="/social-navigation" className="no-underline">
          <div className="border rounded-lg p-6 h-full bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Social Navigation</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Evidence-based strategies for navigating social situations with confidence
            </p>
            <Button variant="outline" className="mt-2">
              Learn More
            </Button>
          </div>
        </Link>

        <Link to="/connection-builder" className="no-underline">
          <div className="border rounded-lg p-6 h-full bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="h-6 w-6 text-purple-500" />
              <h2 className="text-xl font-semibold">Connection Builder</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Build meaningful connections with conversation tools tailored for introverts
            </p>
            <Button variant="outline" className="mt-2">
              Learn More
            </Button>
          </div>
        </Link>

        <Link to="/wellbeing" className="no-underline">
          <div className="border rounded-lg p-6 h-full bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-6 w-6 text-amber-500" />
              <h2 className="text-xl font-semibold">Wellbeing Center</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              AI-powered resources for introvert psychology, mindfulness, and community wisdom
            </p>
            <Button variant="outline" className="mt-2">
              Learn More
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
