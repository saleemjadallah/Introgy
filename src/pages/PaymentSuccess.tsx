
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { usePremium } from "@/contexts/premium/PremiumContext";
import { toast } from "sonner";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { upgradeToPremium } = usePremium();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [planType, setPlanType] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const plan = searchParams.get('plan') as 'monthly' | 'yearly';
    
    if (!sessionId) {
      setStatus('error');
      return;
    }
    
    setPlanType(plan || 'monthly');
    
    const processPayment = async () => {
      try {
        // Call the upgradeToPremium function to update the user's subscription
        await upgradeToPremium(plan || 'monthly');
        setStatus('success');
        toast.success('Your premium subscription has been activated!');
      } catch (error) {
        console.error('Error processing payment:', error);
        setStatus('error');
        toast.error('There was an issue activating your subscription');
      }
    };

    processPayment();
  }, [searchParams, upgradeToPremium]);

  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <Card className="border-2">
        <CardHeader className="text-center">
          {status === 'loading' && (
            <>
              <div className="flex justify-center mb-2">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
              <CardTitle>Processing Your Payment</CardTitle>
              <CardDescription>
                Please wait while we confirm your subscription...
              </CardDescription>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="flex justify-center mb-2">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <CardTitle>Payment Successful!</CardTitle>
              <CardDescription>
                Your premium subscription has been activated
              </CardDescription>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="flex justify-center mb-2">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
              <CardTitle>Payment Error</CardTitle>
              <CardDescription>
                There was an issue processing your payment
              </CardDescription>
            </>
          )}
        </CardHeader>
        
        <CardContent className="text-center">
          {status === 'success' && (
            <div className="space-y-4">
              <p>
                Thank you for subscribing to our Premium Plan 
                ({planType === 'yearly' ? 'Annual' : 'Monthly'})!
              </p>
              <p>
                You now have access to all premium features including 
                unlimited profiles, advanced mindfulness exercises, 
                and complete educational resources.
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <p>
              We couldn't process your payment. Please try again or 
              contact our support team if the problem persists.
            </p>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Button 
            onClick={() => navigate('/profile?tab=pricing')}
            disabled={status === 'loading'}
          >
            {status === 'success' ? 'Go to My Account' : 'Back to Pricing'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
