
import { useEffect, useRef, useState } from 'react';
import { useMemo } from 'react';
import { Circle, User, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRelationships } from '@/hooks/useRelationships';

const CircleRing = ({ radius, color, children }: { radius: number, color: string, children?: React.ReactNode }) => {
  return (
    <div 
      className="absolute rounded-full border-2 flex items-center justify-center"
      style={{ 
        width: `${radius * 2}px`, 
        height: `${radius * 2}px`, 
        borderColor: color,
        transform: 'translate(-50%, -50%)',
        left: '50%',
        top: '50%'
      }}
    >
      {children}
    </div>
  );
};

const RelationshipNode = ({ 
  name, 
  position, 
  importanceLevel,
  category,
  onClick
}: { 
  name: string, 
  position: { x: number, y: number },
  importanceLevel: number,
  category: string,
  onClick: () => void
}) => {
  // Choose color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'family': return 'bg-blue-100';
      case 'friend': return 'bg-green-100';
      case 'professional': return 'bg-purple-100';
      case 'acquaintance': return 'bg-gray-100';
      default: return 'bg-slate-100';
    }
  };

  // Determine size based on importance level (1-5)
  const size = 35 + (importanceLevel * 5);

  return (
    <div 
      className={`absolute rounded-full ${getCategoryColor(category)} flex items-center justify-center 
                  shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-white`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        transform: 'translate(-50%, -50%)',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: importanceLevel
      }}
      onClick={onClick}
    >
      <span className="font-medium text-xs truncate max-w-[80%] text-center">{name.split(' ')[0]}</span>
    </div>
  );
};

const RelationshipMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
  const { toast } = useToast();
  const { relationships, isLoading, error } = useRelationships();

  // Calculate map dimensions on mount and window resize
  useEffect(() => {
    const updateMapSize = () => {
      if (mapRef.current) {
        const { width, height } = mapRef.current.getBoundingClientRect();
        setMapSize({ width, height });
      }
    };

    updateMapSize();
    window.addEventListener('resize', updateMapSize);
    return () => window.removeEventListener('resize', updateMapSize);
  }, []);

  // Calculate the center point of the map
  const center = useMemo(() => {
    return {
      x: mapSize.width / 2,
      y: mapSize.height / 2
    };
  }, [mapSize]);

  // Define concentric circles for importance levels
  const circles = [
    { radius: 60, color: 'rgba(99, 102, 241, 0.2)' },   // Level 5 (closest)
    { radius: 120, color: 'rgba(99, 102, 241, 0.15)' }, // Level 4
    { radius: 180, color: 'rgba(99, 102, 241, 0.1)' },  // Level 3
    { radius: 240, color: 'rgba(99, 102, 241, 0.05)' }, // Level 2
    { radius: 300, color: 'rgba(99, 102, 241, 0.025)' } // Level 1 (furthest)
  ];

  // Calculate positions for each relationship node
  const calculateNodePositions = () => {
    if (!relationships || relationships.length === 0) return {};

    const positions: Record<string, { x: number, y: number }> = {};
    
    // Group by importance level
    const groupedByImportance: Record<number, any[]> = {};
    
    relationships.forEach(rel => {
      const level = rel.importanceLevel || 3; // Default to middle level if not set
      if (!groupedByImportance[level]) {
        groupedByImportance[level] = [];
      }
      groupedByImportance[level].push(rel);
    });
    
    // For each importance level
    Object.entries(groupedByImportance).forEach(([level, rels]) => {
      const numLevel = parseInt(level);
      const radius = circles[5 - numLevel]?.radius || 180; // Invert level for circle mapping (5 is closest)
      
      // Position each relationship around the circle
      rels.forEach((rel, i) => {
        const angle = (i * (2 * Math.PI)) / rels.length;
        const x = center.x + radius * Math.cos(angle);
        const y = center.y + radius * Math.sin(angle);
        
        positions[rel.id] = { x, y };
      });
    });
    
    return positions;
  };

  const nodePositions = useMemo(() => calculateNodePositions(), [relationships, center, circles]);

  const handleNodeClick = (id: string, name: string) => {
    toast({
      title: "Contact Selected",
      description: `${name} selected. Detail view coming soon.`
    });
  };

  const handleAddContact = () => {
    toast({
      title: "Add Contact",
      description: "Contact creation form coming soon."
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center border rounded-lg">
        <p className="text-muted-foreground">Loading your relationships...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[500px] flex items-center justify-center border rounded-lg">
        <div className="text-center space-y-3">
          <p className="text-muted-foreground">Error loading relationships</p>
          <Button variant="outline" size="sm">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white relative">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Relationship Map</h3>
        <Button onClick={handleAddContact} size="sm" variant="outline" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>Add Contact</span>
        </Button>
      </div>
      
      <div ref={mapRef} className="relative min-h-[500px]">
        {mapSize.width > 0 && (
          <>
            {/* Concentric circles */}
            {circles.map((circle, i) => (
              <CircleRing key={i} radius={circle.radius} color={circle.color} />
            ))}
            
            {/* Center self icon */}
            <div 
              className="absolute bg-indigo-100 rounded-full p-2 border-2 border-indigo-300 shadow-md"
              style={{ 
                transform: 'translate(-50%, -50%)',
                left: center.x,
                top: center.y,
                zIndex: 10
              }}
            >
              <User className="h-6 w-6 text-indigo-700" />
            </div>
            
            {/* Relationship nodes */}
            {relationships && relationships.length > 0 ? (
              relationships.map(rel => (
                <RelationshipNode 
                  key={rel.id} 
                  name={rel.name} 
                  position={nodePositions[rel.id] || { x: center.x, y: center.y }} 
                  importanceLevel={rel.importanceLevel || 3}
                  category={rel.category || 'acquaintance'}
                  onClick={() => handleNodeClick(rel.id, rel.name)}
                />
              ))
            ) : (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-6 rounded-lg">
                <Users className="h-16 w-16 mx-auto text-muted-foreground opacity-30 mb-4" />
                <h3 className="text-lg font-medium mb-2">No relationships yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Start building your relationship map by adding your important connections.</p>
                <Button onClick={handleAddContact} className="mx-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Contact
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RelationshipMap;
