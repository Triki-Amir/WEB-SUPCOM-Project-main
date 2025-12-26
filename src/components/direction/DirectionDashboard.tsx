import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DirectionOverview } from "./DirectionOverview";
import { DirectionReports } from "./DirectionReports";
import { DirectionAnalytics } from "./DirectionAnalytics";
import { BarChart3, FileText, TrendingUp } from "lucide-react";

export function DirectionDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2">Tableau de bord Direction</h1>
          <p className="text-gray-600">Vue d'ensemble et analyses de performance</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Vue d'ensemble</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Rapports</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Analyses</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DirectionOverview />
          </TabsContent>

          <TabsContent value="reports">
            <DirectionReports />
          </TabsContent>

          <TabsContent value="analytics">
            <DirectionAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
