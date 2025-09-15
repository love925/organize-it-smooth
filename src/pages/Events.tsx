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
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar,
  Users,
  Clock,
  MapPin
} from "lucide-react";

interface Event {
  id: string;
  clientName: string;
  hall: string;
  time: string;
  eventType: string;
  guestCount: number;
  menu: string;
  date: string;
  status: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "EVT001",
      clientName: "Sarah Johnson",
      hall: "Grand Hall",
      time: "Evening (6-11 PM)",
      eventType: "Wedding",
      guestCount: 150,
      menu: "Premium buffet with continental cuisine",
      date: "2024-01-20",
      status: "completed"
    },
    {
      id: "EVT002",
      clientName: "Tech Corp Inc",
      hall: "Conference Room A",
      time: "Morning (9-1 PM)",
      eventType: "Corporate",
      guestCount: 80,
      menu: "Business lunch with appetizers",
      date: "2024-01-22",
      status: "upcoming"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [formData, setFormData] = useState({
    clientName: "",
    hall: "",
    time: "",
    eventType: "",
    guestCount: "",
    menu: "",
    date: ""
  });

  const hallOptions = ["Grand Hall", "Conference Room A", "Garden Venue"];
  const timeOptions = ["Morning (9-1 PM)", "Afternoon (1-6 PM)", "Evening (6-11 PM)"];
  const eventTypes = ["Wedding", "Corporate", "Anniversary"];

  const generateEventId = () => {
    const eventCount = events.length + 1;
    return `EVT${eventCount.toString().padStart(3, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEvent) {
      setEvents(prev => prev.map(event => 
        event.id === editingEvent.id 
          ? { 
              ...event, 
              ...formData, 
              guestCount: parseInt(formData.guestCount) 
            }
          : event
      ));
    } else {
      const newEvent: Event = {
        id: generateEventId(),
        ...formData,
        guestCount: parseInt(formData.guestCount),
        status: "upcoming"
      };
      setEvents(prev => [...prev, newEvent]);
    }

    // Reset form
    setFormData({
      clientName: "",
      hall: "",
      time: "",
      eventType: "",
      guestCount: "",
      menu: "",
      date: ""
    });
    setEditingEvent(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      clientName: event.clientName,
      hall: event.hall,
      time: event.time,
      eventType: event.eventType,
      guestCount: event.guestCount.toString(),
      menu: event.menu,
      date: event.date
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const filteredEvents = events.filter(event =>
    event.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.date.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">
            Manage your event bookings and details
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingEvent(null);
              setFormData({
                clientName: "",
                hall: "",
                time: "",
                eventType: "",
                guestCount: "",
                menu: "",
                date: ""
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? "Edit Event" : "Create New Event"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hall">Hall</Label>
                  <Select 
                    value={formData.hall} 
                    onValueChange={(value) => setFormData({...formData, hall: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select hall" />
                    </SelectTrigger>
                    <SelectContent>
                      {hallOptions.map((hall) => (
                        <SelectItem key={hall} value={hall}>{hall}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Select 
                    value={formData.time} 
                    onValueChange={(value) => setFormData({...formData, time: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type</Label>
                  <Select 
                    value={formData.eventType} 
                    onValueChange={(value) => setFormData({...formData, eventType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestCount">Guest Count</Label>
                  <Input
                    id="guestCount"
                    type="number"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({...formData, guestCount: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="menu">Menu</Label>
                <Textarea
                  id="menu"
                  value={formData.menu}
                  onChange={(e) => setFormData({...formData, menu: e.target.value})}
                  placeholder="Describe the menu for this event"
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
                  {editingEvent ? "Update Event" : "Create Event"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Event ID, client name, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="grid gap-4">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="hover-lift">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{event.id}</Badge>
                    <Badge 
                      variant={event.status === "completed" ? "default" : "outline"}
                      className="capitalize"
                    >
                      {event.status}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold">{event.clientName}</h3>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.hall}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {event.guestCount} guests
                    </div>
                  </div>
                  
                  <div className="max-w-lg">
                    <p className="text-sm"><strong>Type:</strong> {event.eventType}</p>
                    <p className="text-sm"><strong>Menu:</strong> {event.menu}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(event)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredEvents.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Try adjusting your search terms" : "Create your first event to get started"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}