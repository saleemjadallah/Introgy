
import React from "react";
import { motion } from "framer-motion";
import { Battery, Brain, Users, LineChart, Download, Star, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { AnimatedCard } from "@/components/animations/AnimatedCard";
import { AnimatedButton } from "@/components/animations/AnimatedButton";
import { AnimatedTransition } from "@/components/animations/AnimatedTransition";
import { WaitingListForm } from "@/components/WaitingListForm";

const Index = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="space-y-6 md:space-y-10 mx-auto w-full max-w-7xl px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero Section */}
      <AnimatedTransition type="slide" transitionKey="hero">
        <div className="text-center space-y-4 py-8 md:py-12">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            Introgy
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            The app designed for introverts to manage social energy and build meaningful connections
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center"
          >
            <WaitingListForm>
              <Button size="lg" id="download-app" className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 text-lg">
                <Download className="mr-2 h-5 w-5" /> Coming Soon - Get Notified
              </Button>
            </WaitingListForm>
            <p className="text-sm text-muted-foreground mt-2">Be the first to know when we launch</p>
          </motion.div>
        </div>
      </AnimatedTransition>

      {/* App Screenshot or Preview */}
      <AnimatedTransition type="fade" transitionKey="screenshot">
        <div className="flex justify-center py-4 md:py-8">
          <div className="relative w-full max-w-4xl">
            <img 
              src="/lovable-uploads/9a061ed0-0536-43f4-96a2-f95a14d5242f.png" 
              alt="Introgy - Recharge. Reflect. Thrive." 
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </AnimatedTransition>

      {/* Key Features */}
      <section className="py-8 md:py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <AnimatedCard 
            className="h-full battery-container-gradient w-full overflow-hidden shadow-lg border border-white/40 cursor-pointer"
            onClick={() => navigate('/social-battery')}
          >
            <CardHeader className="pb-2 px-4 pt-4 md:px-6 md:pt-6">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Battery className="h-5 w-5 text-sage" />
                Social Battery
              </CardTitle>
              <CardDescription>Track and manage your social energy levels</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 md:px-6">
              <p className="text-sm md:text-base">
                Monitor your energy levels throughout the day, understand what drains you, and get personalized 
                recommendations to help maintain a healthy balance.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Visualize your energy levels</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Get recharge recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Set boundaries with confidence</span>
                </div>
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard 
            className="h-full navigation-container-gradient w-full overflow-hidden shadow-lg border border-white/40 cursor-pointer"
            onClick={() => navigate('/social-navigation')}
          >
            <CardHeader className="pb-2 px-4 pt-4 md:px-6 md:pt-6">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Users className="h-5 w-5 text-periwinkle" />
                Social Navigation
              </CardTitle>
              <CardDescription>Tools for navigating social situations</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 md:px-6">
              <p className="text-sm md:text-base">
                Prepare for social events with guided exercises, practice conversations, and access real-time 
                support during challenging social situations.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Conversation practice tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Event preparation guides</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Real-time anxiety management</span>
                </div>
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard 
            className="h-full connection-container-gradient w-full overflow-hidden shadow-lg border border-white/40 cursor-pointer"
            onClick={() => navigate('/connection-builder')}
          >
            <CardHeader className="pb-2 px-4 pt-4 md:px-6 md:pt-6">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Brain className="h-5 w-5 text-mauve" />
                Connection Builder
              </CardTitle>
              <CardDescription>Create meaningful relationships</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 md:px-6">
              <p className="text-sm md:text-base">
                Find compatible connections based on your personality and preferences, 
                and maintain relationships with less effort through our intuitive tools.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Compatibility matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Communication preference profiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Low-effort relationship maintenance</span>
                </div>
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard 
            className="h-full wellbeing-container-gradient w-full overflow-hidden shadow-lg border border-white/40 cursor-pointer"
            onClick={() => navigate('/wellbeing')}
          >
            <CardHeader className="pb-2 px-4 pt-4 md:px-6 md:pt-6">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <LineChart className="h-5 w-5 text-blueteal" />
                Wellbeing Center
              </CardTitle>
              <CardDescription>Resources for introvert wellness</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6 md:px-6">
              <p className="text-sm md:text-base">
                Access mindfulness exercises, educational content, and community wisdom 
                tailored specifically for introverts' unique needs.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Introvert-focused meditation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Educational resources</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Community-shared experiences</span>
                </div>
              </div>
            </CardContent>
          </AnimatedCard>
        </div>
      </section>

      {/* Download CTA */}
      <section className="py-8 md:py-16 text-center">
        <AnimatedTransition type="scaleFade" transitionKey="download-cta">
          <div className="bg-gradient-to-r from-purple-200 to-indigo-200 text-gray-800 p-8 md:p-12 rounded-3xl border border-purple-300 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Ready to manage your social energy?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-700">
              Join our waiting list and be the first to experience Introgy when we launch. Get early access to tools designed specifically for introverts.
            </p>
            <div className="flex flex-col items-center">
              <WaitingListForm>
                <AnimatedButton 
                  size="lg" 
                  className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-6 text-lg font-semibold shadow-lg"
                >
                  <Download className="mr-2 h-5 w-5" /> Join the Waiting List
                </AnimatedButton>
              </WaitingListForm>
              <p className="mt-4 text-sm text-gray-600">Coming soon to iOS. Android version in development.</p>
            </div>
          </div>
        </AnimatedTransition>
      </section>
    </motion.div>
  );
};

export default Index;
