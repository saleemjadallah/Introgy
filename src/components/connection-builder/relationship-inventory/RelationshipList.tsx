
import { useState } from 'react';
import { Plus, User2, ChevronDown, ChevronUp, Search, Filter, SlidersHorizontal, Star, StarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRelationships } from '@/hooks/useRelationships';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

type SortOption = 'name' | 'lastInteraction' | 'healthScore' | 'importanceLevel';
type FilterCategory = 'all' | 'family' | 'friend' | 'professional' | 'acquaintance';

const RelationshipList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const { toast } = useToast();
  const { relationships, isLoading, error } = useRelationships();

  const handleAddContact = () => {
    toast({
      title: "Add Contact",
      description: "Contact creation form coming soon."
    });
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      toggleSortDirection();
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'family': return 'bg-blue-100 text-blue-800';
      case 'friend': return 'bg-green-100 text-green-800';
      case 'professional': return 'bg-purple-100 text-purple-800';
      case 'acquaintance': return 'bg-gray-100 text-gray-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getHealthColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Apply filters and sorting
  const filteredAndSortedRelationships = relationships
    ? relationships
        .filter(rel => {
          // Apply category filter
          if (filterCategory !== 'all' && rel.category !== filterCategory) {
            return false;
          }
          // Apply search filter
          if (searchQuery) {
            return rel.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   rel.nickname?.toLowerCase().includes(searchQuery.toLowerCase());
          }
          return true;
        })
        .sort((a, b) => {
          // Apply sorting
          if (sortBy === 'name') {
            return sortDirection === 'asc' 
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);
          }
          if (sortBy === 'importanceLevel') {
            const aVal = a.importanceLevel || 0;
            const bVal = b.importanceLevel || 0;
            return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
          }
          if (sortBy === 'healthScore') {
            const aVal = a.nurturingStatus?.currentHealthScore || 0;
            const bVal = b.nurturingStatus?.currentHealthScore || 0;
            return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
          }
          if (sortBy === 'lastInteraction') {
            const aDate = a.nurturingStatus?.lastInteraction ? new Date(a.nurturingStatus.lastInteraction) : new Date(0);
            const bDate = b.nurturingStatus?.lastInteraction ? new Date(b.nurturingStatus.lastInteraction) : new Date(0);
            return sortDirection === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
          }
          return 0;
        })
    : [];

  const contactCount = filteredAndSortedRelationships.length;

  // Render skeleton loaders
  if (isLoading) {
    return (
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">Your Contacts</h3>
          <Button size="sm" variant="outline" disabled>
            <Plus className="h-4 w-4 mr-1" />
            Add Contact
          </Button>
        </div>
        
        <div className="p-4 space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
          </div>
          
          <div className="space-y-4 mt-6">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-md">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Your Contacts</h3>
        </div>
        
        <div className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Error loading your relationships</p>
          <Button variant="outline">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Contacts</h3>
        <Button onClick={handleAddContact} size="sm" variant="outline" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>Add Contact</span>
        </Button>
      </div>
      
      <div className="p-4">
        {/* Search and filter row */}
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setFilterCategory('all')}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCategory('family')}>
                Family
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCategory('friend')}>
                Friends
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCategory('professional')}>
                Professional
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCategory('acquaintance')}>
                Acquaintances
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shrink-0 flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Sort</span>
                {sortDirection === 'asc' ? (
                  <ChevronUp className="h-3 w-3 ml-1" />
                ) : (
                  <ChevronDown className="h-3 w-3 ml-1" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort('name')}>
                By Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('importanceLevel')}>
                By Importance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('healthScore')}>
                By Health Score
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('lastInteraction')}>
                By Last Interaction
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Filter badges */}
        {(filterCategory !== 'all' || searchQuery) && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {filterCategory !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {filterCategory}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => setFilterCategory('all')}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchQuery}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => setSearchQuery('')}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            <Badge variant="outline">
              {contactCount} contact{contactCount !== 1 ? 's' : ''} found
            </Badge>
          </div>
        )}
        
        {/* Contact list */}
        <div className="space-y-2 mt-6">
          {filteredAndSortedRelationships.length > 0 ? (
            filteredAndSortedRelationships.map(contact => (
              <div 
                key={contact.id} 
                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-md cursor-pointer transition-colors"
              >
                <div className="relative">
                  {/* Avatar placeholder */}
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center 
                                 ${getCategoryColor(contact.category).split(' ')[0]}`}>
                    <User2 className="h-5 w-5" />
                  </div>
                  
                  {/* Importance stars */}
                  {contact.importanceLevel && contact.importanceLevel > 3 && (
                    <div className="absolute -top-1 -right-1 bg-amber-400 rounded-full p-0.5">
                      <Star className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium truncate">{contact.name}</h4>
                    <Badge 
                      variant="secondary" 
                      className={cn("text-xs", getCategoryColor(contact.category))}
                    >
                      {contact.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    {contact.nickname && (
                      <span className="truncate italic">{contact.nickname}</span>
                    )}
                    
                    {contact.nurturingStatus?.currentHealthScore && (
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getHealthColor(contact.nurturingStatus.currentHealthScore))}
                      >
                        Health: {contact.nurturingStatus.currentHealthScore}/10
                      </Badge>
                    )}
                    
                    {contact.nurturingStatus?.needsAttention && (
                      <Badge variant="outline" className="bg-red-100 text-red-800 text-xs">
                        Needs attention
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <User2 className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-3" />
              {searchQuery || filterCategory !== 'all' ? (
                <>
                  <h4 className="text-lg font-medium mb-1">No matching contacts</h4>
                  <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filters</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setFilterCategory('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </>
              ) : (
                <>
                  <h4 className="text-lg font-medium mb-1">No contacts yet</h4>
                  <p className="text-sm text-muted-foreground mb-4">Start building your connections</p>
                  <Button onClick={handleAddContact}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Contact
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelationshipList;
