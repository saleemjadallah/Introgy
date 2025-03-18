
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="container max-w-3xl py-6">
      <Button variant="ghost" className="mb-4" asChild>
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Introgy. These Terms & Conditions govern your use of our application and services.
            By accessing or using Introgy, you agree to be bound by these Terms.
          </p>
          
          <h2>2. Use of the Application</h2>
          <p>
            Introgy provides tools for tracking social energy, navigating social situations, and improving wellbeing.
            You agree to use the application only for lawful purposes and in accordance with these Terms.
          </p>
          
          <h2>3. User Accounts</h2>
          <p>
            When you create an account, you are responsible for maintaining the confidentiality of your account information
            and for all activities that occur under your account.
          </p>
          
          <h2>4. Subscription and Payments</h2>
          <p>
            Introgy offers premium features through subscription plans. All payments are processed securely through
            our payment processors. Subscriptions will automatically renew unless cancelled before the renewal date.
          </p>
          
          <h2>5. Data Usage and Privacy</h2>
          <p>
            Your privacy is important to us. Please refer to our <Link to="/privacy" className="text-primary">Privacy Policy</Link> for 
            information on how we collect, use, and protect your personal data.
          </p>
          
          <h2>6. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. If we make significant changes, we will notify you
            through the application or via email.
          </p>
          
          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@introgy.app.
          </p>
          
          <div className="text-sm text-muted-foreground mt-8">
            Last updated: May 25, 2024
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Terms;
