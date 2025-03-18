
import React from 'react';
import { NurturingStats } from '@/types/relationship-nurturing';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Bell, Clock } from "lucide-react";
import RelationshipStatsChart from './RelationshipStatsChart';
import { Progress } from "@/components/ui/progress";

interface RelationshipStatsDashboardProps {
  stats: NurturingStats | null;
}

export const RelationshipStatsDashboard: React.FC<RelationshipStatsDashboardProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="flex items-center justify-center h-48 bg-slate-50 rounded-lg">
        <p className="text-muted-foreground">No stats available</p>
      </div>
    );
  }

  const { 
    plannedToday, 
    completedToday, 
    plannedThisWeek, 
    completedThisWeek,
    overdueCount,
    healthyRelationships,
    needsAttentionCount,
    upcomingEvents
  } = stats;

  const todayCompletionRate = plannedToday > 0 
    ? Math.round((completedToday / plannedToday) * 100) 
    : 0;
  
  const weekCompletionRate = plannedThisWeek > 0 
    ? Math.round((completedThisWeek / plannedThisWeek) * 100) 
    : 0;

  const totalRelationships = healthyRelationships + needsAttentionCount;
  const healthRate = totalRelationships > 0 
    ? Math.round((healthyRelationships / totalRelationships) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>Daily Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-2">
              <div className="text-2xl font-bold">{completedToday}/{plannedToday}</div>
              <div className="text-sm text-muted-foreground">Completed today</div>
            </div>
            <Progress 
              value={todayCompletionRate} 
              indicatorClassName={todayCompletionRate > 70 ? "bg-green-500" : todayCompletionRate > 30 ? "bg-amber-500" : "bg-red-500"}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Relationship Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-2">
              <div className="text-2xl font-bold">{healthyRelationships}/{totalRelationships}</div>
              <div className="text-sm text-muted-foreground">Healthy relationships</div>
            </div>
            <Progress 
              value={healthRate} 
              indicatorClassName={healthRate > 70 ? "bg-green-500" : healthRate > 30 ? "bg-amber-500" : "bg-red-500"}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Weekly Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-2">
              <div className="text-2xl font-bold">{completedThisWeek}/{plannedThisWeek}</div>
              <div className="text-sm text-muted-foreground">Completed this week</div>
            </div>
            <Progress 
              value={weekCompletionRate} 
              indicatorClassName={weekCompletionRate > 70 ? "bg-green-500" : weekCompletionRate > 30 ? "bg-amber-500" : "bg-red-500"}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Attention Required</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-orange-50 rounded-md p-3 text-center">
                <div className="text-xl font-bold text-orange-600">{overdueCount}</div>
                <div className="text-xs text-muted-foreground">Overdue</div>
              </div>
              <div className="bg-blue-50 rounded-md p-3 text-center">
                <div className="text-xl font-bold text-blue-600">{upcomingEvents}</div>
                <div className="text-xs text-muted-foreground">Events</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <RelationshipStatsChart stats={stats} />
    </div>
  );
};

export default RelationshipStatsDashboard;
