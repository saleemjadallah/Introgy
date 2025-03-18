
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
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
          <CardTitle className="text-xl sm:text-2xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <h2>1. Introduction</h2>
          <p>
            At Introgy, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
            disclose, and safeguard your information when you use our application.
          </p>
          
          <h2>2. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as account information, profile data,
            and usage information. We also collect certain technical data about your device and how you
            interact with our application.
          </p>
          
          <h2>3. How We Use Your Information</h2>
          <p>
            We use your information to provide, maintain, and improve our services, personalize your
            experience, communicate with you, and ensure the security of our application.
          </p>
          
          <h2>4. Data Storage and Security</h2>
          <p>
            Your data is stored on secure servers and we implement appropriate security measures to protect
            your personal information from unauthorized access or disclosure.
          </p>
          
          <h2>5. Your Rights</h2>
          <p>
            Depending on your location, you may have rights regarding your personal data, including the right
            to access, update, delete, or restrict the processing of your information.
          </p>
          
          <h2>6. Third-Party Services</h2>
          <p>
            Our application may integrate with third-party services. These services have their own privacy
            policies, and we encourage you to review them.
          </p>
          
          <h2>7. Changes to this Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any significant changes
            by posting the new policy on this page.
          </p>
          
          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@introgy.app.
          </p>
          
          <div className="text-sm text-muted-foreground mt-8">
            Last updated: May 25, 2024
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Privacy;
