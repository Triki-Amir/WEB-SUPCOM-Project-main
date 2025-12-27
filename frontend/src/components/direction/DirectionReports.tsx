import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FileText, Download, Calendar, TrendingUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";

interface StationStats {
  name: string;
  city: string;
  bookingsCount: number;
  revenue?: number;
}

interface UserStats {
  totalUsers: number;
  activeClients: number;
  newThisMonth: number;
}

interface Report {
  id: string;
  title: string;
  type: "monthly" | "quarterly" | "annual";
  period: string;
  generatedDate: string;
  size: string;
  status: "ready" | "generating" | "scheduled";
}

export function DirectionReports() {
  const [stationStats, setStationStats] = useState<StationStats[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const [stationsData, usersData] = await Promise.all([
        api.analytics.getStationStatistics(),
        api.analytics.getUserStatistics()
      ]);
      setStationStats(stationsData);
      setUserStats(usersData);
    } catch (error) {
      console.error("Error loading report data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const reports: Report[] = [
    {
      id: "1",
      title: "Rapport Mensuel - Juin 2025",
      type: "monthly",
      period: "Juin 2025",
      generatedDate: "1 Juil 2025",
      size: "2.4 MB",
      status: "ready",
    },
    {
      id: "2",
      title: "Rapport Mensuel - Mai 2025",
      type: "monthly",
      period: "Mai 2025",
      generatedDate: "1 Juin 2025",
      size: "2.1 MB",
      status: "ready",
    },
    {
      id: "3",
      title: "Rapport Trimestriel Q2 2025",
      type: "quarterly",
      period: "Avr-Juin 2025",
      generatedDate: "1 Juil 2025",
      size: "5.8 MB",
      status: "ready",
    },
    {
      id: "4",
      title: "Rapport Annuel 2024",
      type: "annual",
      period: "2024",
      generatedDate: "15 Jan 2025",
      size: "12.3 MB",
      status: "ready",
    },
    {
      id: "5",
      title: "Rapport Mensuel - Juillet 2025",
      type: "monthly",
      period: "Juillet 2025",
      generatedDate: "À venir",
      size: "-",
      status: "scheduled",
    },
  ];

  const handleDownloadReport = (reportId: string, reportTitle: string) => {
    toast.success(`Téléchargement du rapport: ${reportTitle}`);
  };

  const handleGenerateReport = () => {
    toast.success("Génération du rapport en cours...");
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ready: { label: "Disponible", variant: "default" as const },
      generating: { label: "En cours", variant: "secondary" as const },
      scheduled: { label: "Planifié", variant: "secondary" as const },
    };
    const { label, variant } = variants[status as keyof typeof variants];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      monthly: { label: "Mensuel", color: "bg-blue-100 text-blue-800" },
      quarterly: { label: "Trimestriel", color: "bg-purple-100 text-purple-800" },
      annual: { label: "Annuel", color: "bg-green-100 text-green-800" },
    };
    const { label, color } = variants[type as keyof typeof variants];
    return <Badge className={color}>{label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Statistiques des stations</CardTitle>
          </CardHeader>
          <CardContent>
            {stationStats.length > 0 ? (
              <div className="space-y-3">
                {stationStats.slice(0, 5).map((station: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{station.name}</h4>
                      <p className="text-sm text-gray-600">{station.city}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{station.bookingsCount} réservations</div>
                      <div className="text-sm text-gray-600">{station.revenue?.toFixed(2) || 0} TND</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">Aucune donnée disponible</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            {userStats ? (
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Total utilisateurs</div>
                  <div className="text-2xl font-bold">{userStats.totalUsers || 0}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Clients actifs</div>
                  <div className="text-2xl font-bold">{userStats.activeClients || 0}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Nouveaux ce mois</div>
                  <div className="text-2xl font-bold">{userStats.newThisMonth || 0}</div>
                </div>
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">Aucune donnée disponible</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Générer un nouveau rapport</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm">Type de rapport</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                  <SelectItem value="quarterly">Trimestriel</SelectItem>
                  <SelectItem value="annual">Annuel</SelectItem>
                  <SelectItem value="custom">Personnalisé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm">Période</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="june-2025">Juin 2025</SelectItem>
                  <SelectItem value="may-2025">Mai 2025</SelectItem>
                  <SelectItem value="q2-2025">Q2 2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm">Format</label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleGenerateReport}>
            <FileText className="w-4 h-4 mr-2" />
            Générer le rapport
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rapports disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4>{report.title}</h4>
                          {getTypeBadge(report.type)}
                          {getStatusBadge(report.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{report.generatedDate}</span>
                          </div>
                          {report.size !== "-" && (
                            <span>{report.size}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {report.status === "ready" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadReport(report.id, report.title)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Métriques clés - Juin 2025</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Revenu total</span>
                <span>67,340 TND</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Réservations</span>
                <span>450</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Taux d'utilisation</span>
                <span>78%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Nouveaux clients</span>
                <span>124</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Revenu</span>
                </div>
                <span className="text-green-600">+12.5%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Satisfaction</span>
                </div>
                <span className="text-green-600">+4.3%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Utilisation</span>
                </div>
                <span className="text-green-600">+3.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Points d'attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <p className="text-sm">Coûts de maintenance en hausse de 8%</p>
              </div>
              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-sm">Opportunité d'expansion à Nabeul</p>
              </div>
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-sm">Taux d'utilisation faible à Monastir</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
