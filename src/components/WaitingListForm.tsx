import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WaitingListFormProps {
  children: React.ReactNode;
}

export const WaitingListForm = ({ children }: WaitingListFormProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both name and email fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('waiting_list')
        .insert({
          name: name.trim(),
          email: email.trim().toLowerCase(),
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already Registered",
            description: "This email is already on our waiting list. We'll notify you when the app launches!",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        setIsSuccess(true);
        toast({
          title: "Welcome to the Waiting List!",
          description: "We'll notify you as soon as Introgy launches on iOS.",
        });
        
        // Reset form after success
        setTimeout(() => {
          setName("");
          setEmail("");
          setIsSuccess(false);
          setOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding to waiting list:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setIsSuccess(false);
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        resetForm();
      }
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] mx-4 my-8 p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-purple-600" />
            Join the Waiting List
          </DialogTitle>
          <DialogDescription>
            Be the first to know when Introgy launches on iOS. Get early access to tools designed specifically for introverts.
          </DialogDescription>
        </DialogHeader>
        
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">You're on the list!</h3>
            <p className="text-muted-foreground">
              We'll notify you as soon as Introgy is available on iOS.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Join Waiting List
                </>
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              We'll only use your email to notify you about Introgy's launch. No spam, ever.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};