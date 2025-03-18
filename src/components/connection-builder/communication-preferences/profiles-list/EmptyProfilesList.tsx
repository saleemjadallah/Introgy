
import { Button } from '@/components/ui/button';
import { ListPlus } from 'lucide-react';

interface EmptyProfilesListProps {
  onCreateNew: () => void;
}

const EmptyProfilesList = ({ onCreateNew }: EmptyProfilesListProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-6 sm:py-8">
      <div className="text-center space-y-2 px-4">
        <h3 className="text-lg sm:text-xl font-semibold">No Communication Profiles Yet</h3>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md">
          Create your first communication profile to define how you prefer others to interact with you.
        </p>
      </div>
      <Button 
        onClick={onCreateNew} 
        className="mt-2 w-full sm:w-auto py-5 sm:py-2 text-base sm:text-sm max-w-xs"
      >
        <ListPlus className="mr-2 h-4 w-4" />
        Create Your First Profile
      </Button>
    </div>
  );
};

export default EmptyProfilesList;
