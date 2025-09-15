import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  Users, 
  Star, 
  TrendingUp, 
  Edit,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [satisfiedCustomers, setSatisfiedCustomers] = useState(247);
  const [isEditingCustomers, setIsEditingCustomers] = useState(false);
  const [tempCustomerValue, setTempCustomerValue] = useState(satisfiedCustomers.toString());

  const handleUpdateCustomers = () => {
    setSatisfiedCustomers(parseInt(tempCustomerValue) || 0);
    setIsEditingCustomers(false);
  };

  const metrics = [
    {
      title: "Total Events",
      value: "42",
      change: "+12%",
      icon: Calendar,
      color: "text-metric-primary",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20"
    },
    {
      title: "Satisfied Customers",
      value: satisfiedCustomers.toString(),
      change: "+8%",
      icon: Star,
      color: "text-metric-secondary",
      bgColor: "bg-violet-50 dark:bg-violet-950/20",
      editable: true
    },
    {
      title: "Active Vendors",
      value: "18",
      change: "+3%",
      icon: Users,
      color: "text-metric-accent",
      bgColor: "bg-amber-50 dark:bg-amber-950/20"
    },
    {
      title: "Revenue This Month",
      value: "$24,500",
      change: "+18%",
      icon: DollarSign,
      color: "text-metric-primary",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20"
    }
  ];

  const recentEvents = [
    {
      id: "EVT001",
      client: "Sarah Johnson",
      type: "Wedding",
      date: "2024-01-20",
      status: "completed",
      guests: 150
    },
    {
      id: "EVT002", 
      client: "Tech Corp Inc",
      type: "Corporate",
      date: "2024-01-22",
      status: "upcoming",
      guests: 80
    },
    {
      id: "EVT003",
      client: "Mike & Anna",
      type: "Anniversary",
      date: "2024-01-25",
      status: "in-progress",
      guests: 60
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your events.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isEditable = metric.editable && metric.title === "Satisfied Customers";
          
          return (
            <Card key={index} className="metric-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {isEditable && isEditingCustomers ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={tempCustomerValue}
                        onChange={(e) => setTempCustomerValue(e.target.value)}
                        className="h-8 text-2xl font-bold"
                        type="number"
                      />
                      <Button
                        size="sm"
                        onClick={handleUpdateCustomers}
                        className="h-8 px-2"
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{metric.value}</div>
                      {isEditable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setTempCustomerValue(metric.value);
                            setIsEditingCustomers(true);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                  <div className="flex items-center text-xs text-success">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {metric.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Events */}
      <Card className="fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border rounded-lg hover-lift"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <div className="font-semibold">{event.client}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.id} • {event.type}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="h-3 w-3" />
                      {event.guests} guests
                    </div>
                  </div>
                  
                  <Badge
                    variant={
                      event.status === "completed" ? "default" :
                      event.status === "upcoming" ? "secondary" : "outline"
                    }
                    className="capitalize"
                  >
                    {event.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="fade-in">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <Calendar className="h-6 w-6" />
              <span>New Event</span>
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <Users className="h-6 w-6" />
              <span>Add Vendor</span>
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <DollarSign className="h-6 w-6" />
              <span>Record Expense</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}