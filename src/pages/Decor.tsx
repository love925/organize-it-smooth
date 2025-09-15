import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Palette, 
  Search, 
  FileText, 
  Calculator,
  Sparkles,
  Music,
  Zap,
  Snowflake
} from "lucide-react";

interface DecorData {
  id: string;
  eventId: string;
  clientName: string;
  hall: string;
  time: string;
  decorAmount: number;
  djAmount: number;
  spotlightAmount: number;
  coolFireCount: number;
  coolFireAmount: number;
  icePotCount: number;
  icePotAmount: number;
  confettiAmount: number;
  percentage: number;
  receivedAmount: number;
  comment: string;
}

export default function Decor() {
  const [decorData, setDecorData] = useState<DecorData[]>([
    {
      id: "DCR001",
      eventId: "EVT001",
      clientName: "Sarah Johnson",
      hall: "Grand Hall",
      time: "Evening (6-11 PM)",
      decorAmount: 5000,
      djAmount: 2000,
      spotlightAmount: 800,
      coolFireCount: 4,
      coolFireAmount: 1200,
      icePotCount: 2,
      icePotAmount: 600,
      confettiAmount: 300,
      percentage: 70,
      receivedAmount: 6930,
      comment: "Premium wedding decoration package"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock events data (would come from events context/store in real app)
  const availableEvents = [
    { id: "EVT002", clientName: "Tech Corp Inc", hall: "Conference Room A", time: "Morning (9-1 PM)" },
    { id: "EVT003", clientName: "Mike & Anna", hall: "Garden Venue", time: "Afternoon (1-6 PM)" }
  ];

  const [formData, setFormData] = useState({
    eventId: "",
    decorAmount: "",
    djAmount: "",
    spotlightAmount: "",
    coolFireCount: "",
    coolFireAmount: "",
    icePotCount: "",
    icePotAmount: "",
    confettiAmount: "",
    percentage: "",
    comment: ""
  });

  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const calculateTotal = () => {
    const amounts = [
      parseFloat(formData.decorAmount) || 0,
      parseFloat(formData.djAmount) || 0,
      parseFloat(formData.spotlightAmount) || 0,
      parseFloat(formData.coolFireAmount) || 0,
      parseFloat(formData.icePotAmount) || 0,
      parseFloat(formData.confettiAmount) || 0
    ];
    return amounts.reduce((sum, amount) => sum + amount, 0);
  };

  const calculateReceivedAmount = () => {
    const total = calculateTotal();
    const percentage = parseFloat(formData.percentage) || 0;
    return (total * percentage) / 100;
  };

  const handleEventSelect = (eventId: string) => {
    const event = availableEvents.find(e => e.id === eventId);
    setSelectedEvent(event);
    setFormData({...formData, eventId});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDecorData: DecorData = {
      id: `DCR${(decorData.length + 1).toString().padStart(3, '0')}`,
      eventId: formData.eventId,
      clientName: selectedEvent?.clientName || "",
      hall: selectedEvent?.hall || "",
      time: selectedEvent?.time || "",
      decorAmount: parseFloat(formData.decorAmount) || 0,
      djAmount: parseFloat(formData.djAmount) || 0,
      spotlightAmount: parseFloat(formData.spotlightAmount) || 0,
      coolFireCount: parseInt(formData.coolFireCount) || 0,
      coolFireAmount: parseFloat(formData.coolFireAmount) || 0,
      icePotCount: parseInt(formData.icePotCount) || 0,
      icePotAmount: parseFloat(formData.icePotAmount) || 0,
      confettiAmount: parseFloat(formData.confettiAmount) || 0,
      percentage: parseFloat(formData.percentage) || 0,
      receivedAmount: calculateReceivedAmount(),
      comment: formData.comment
    };

    setDecorData(prev => [...prev, newDecorData]);
    
    // Reset form
    setFormData({
      eventId: "",
      decorAmount: "",
      djAmount: "",
      spotlightAmount: "",
      coolFireCount: "",
      coolFireAmount: "",
      icePotCount: "",
      icePotAmount: "",
      confettiAmount: "",
      percentage: "",
      comment: ""
    });
    setSelectedEvent(null);
    setIsDialogOpen(false);
  };

  const filteredDecorData = decorData.filter(decor =>
    decor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    decor.eventId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    decor.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = calculateTotal();
  const receivedAmount = calculateReceivedAmount();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Decor Management</h1>
          <p className="text-muted-foreground">
            Manage decoration details and calculations for events
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Palette className="h-4 w-4 mr-2" />
              Add Decor Data
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Decor Data</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Selection */}
              <div className="space-y-2">
                <Label htmlFor="eventId">Select Event</Label>
                <Select 
                  value={formData.eventId} 
                  onValueChange={handleEventSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEvents.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.id} - {event.clientName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedEvent && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div><strong>Client:</strong> {selectedEvent.clientName}</div>
                      <div><strong>Hall:</strong> {selectedEvent.hall}</div>
                      <div><strong>Time:</strong> {selectedEvent.time}</div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Decoration Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="decorAmount">Decor Amount ($)</Label>
                  <div className="relative">
                    <Sparkles className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="decorAmount"
                      type="number"
                      step="0.01"
                      className="pl-10"
                      value={formData.decorAmount}
                      onChange={(e) => setFormData({...formData, decorAmount: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="djAmount">DJ Amount ($)</Label>
                  <div className="relative">
                    <Music className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="djAmount"
                      type="number"
                      step="0.01"
                      className="pl-10"
                      value={formData.djAmount}
                      onChange={(e) => setFormData({...formData, djAmount: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spotlightAmount">Spotlight Amount ($)</Label>
                  <div className="relative">
                    <Zap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="spotlightAmount"
                      type="number"
                      step="0.01"
                      className="pl-10"
                      value={formData.spotlightAmount}
                      onChange={(e) => setFormData({...formData, spotlightAmount: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confettiAmount">Confetti Amount ($)</Label>
                  <Input
                    id="confettiAmount"
                    type="number"
                    step="0.01"
                    value={formData.confettiAmount}
                    onChange={(e) => setFormData({...formData, confettiAmount: e.target.value})}
                  />
                </div>
              </div>

              {/* Cool Fire Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coolFireCount">Cool Fire Count</Label>
                  <Input
                    id="coolFireCount"
                    type="number"
                    value={formData.coolFireCount}
                    onChange={(e) => setFormData({...formData, coolFireCount: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coolFireAmount">Cool Fire Amount ($)</Label>
                  <Input
                    id="coolFireAmount"
                    type="number"
                    step="0.01"
                    value={formData.coolFireAmount}
                    onChange={(e) => setFormData({...formData, coolFireAmount: e.target.value})}
                  />
                </div>
              </div>

              {/* Ice Pot Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icePotCount">Ice Pot Count</Label>
                  <div className="relative">
                    <Snowflake className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="icePotCount"
                      type="number"
                      className="pl-10"
                      value={formData.icePotCount}
                      onChange={(e) => setFormData({...formData, icePotCount: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icePotAmount">Ice Pot Amount ($)</Label>
                  <Input
                    id="icePotAmount"
                    type="number"
                    step="0.01"
                    value={formData.icePotAmount}
                    onChange={(e) => setFormData({...formData, icePotAmount: e.target.value})}
                  />
                </div>
              </div>

              {/* Percentage and Calculation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="percentage">Percentage Expected (%)</Label>
                  <div className="relative">
                    <Calculator className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="percentage"
                      type="number"
                      step="0.01"
                      className="pl-10"
                      value={formData.percentage}
                      onChange={(e) => setFormData({...formData, percentage: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Calculated Received Amount</Label>
                  <div className="text-2xl font-bold text-success">
                    ${receivedAmount.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total: ${totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <Label htmlFor="comment">Comments</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  placeholder="Additional notes about the decoration"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Decor Data
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Available Events Alert */}
      {availableEvents.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <Palette className="h-5 w-5" />
              Events Without Decor Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {availableEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-2 bg-background rounded border">
                  <div>
                    <span className="font-medium">{event.id}</span> - {event.clientName}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => {
                    handleEventSelect(event.id);
                    setIsDialogOpen(true);
                  }}>
                    Add Decor
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, Event ID, or client name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Decor Data List */}
      <div className="grid gap-4">
        {filteredDecorData.map((decor) => (
          <Card key={decor.id} className="hover-lift">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{decor.id}</Badge>
                    <Badge variant="outline">{decor.eventId}</Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Print PDF
                    </Button>
                  </div>
                </div>

                {/* Event Details */}
                <div>
                  <h3 className="text-xl font-semibold mb-2">{decor.clientName}</h3>
                  <div className="text-sm text-muted-foreground mb-3">
                    {decor.hall} • {decor.time}
                  </div>
                </div>

                {/* Amounts Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Decor</div>
                    <div className="font-semibold">${decor.decorAmount}</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">DJ</div>
                    <div className="font-semibold">${decor.djAmount}</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Spotlight</div>
                    <div className="font-semibold">${decor.spotlightAmount}</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Confetti</div>
                    <div className="font-semibold">${decor.confettiAmount}</div>
                  </div>
                </div>

                {/* Effects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Cool Fire</div>
                      <div className="text-sm text-muted-foreground">{decor.coolFireCount} units</div>
                    </div>
                    <div className="font-semibold">${decor.coolFireAmount}</div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Ice Pot</div>
                      <div className="text-sm text-muted-foreground">{decor.icePotCount} units</div>
                    </div>
                    <div className="font-semibold">${decor.icePotAmount}</div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Expected {decor.percentage}% of total
                    </div>
                    <div className="font-semibold">Total: ${
                      (decor.decorAmount + decor.djAmount + decor.spotlightAmount + 
                       decor.coolFireAmount + decor.icePotAmount + decor.confettiAmount).toFixed(2)
                    }</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Received Amount</div>
                    <div className="text-2xl font-bold text-success">${decor.receivedAmount.toFixed(2)}</div>
                  </div>
                </div>

                {/* Comment */}
                {decor.comment && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm font-medium mb-1">Comments:</div>
                    <div className="text-sm">{decor.comment}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredDecorData.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No decor data found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Try adjusting your search terms" : "Add decor data for your events"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}