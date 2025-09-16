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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  FileText, 
  Download,
  Calendar,
  Users,
  DollarSign,
  Filter,
  Music,
  Zap,
  Snowflake,
  Sparkles,
  Edit3
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VendorSearchResult {
  id: string;
  vendorName: string;
  paymentDate: string;
  amount: number;
  purpose: string;
  paymentChannel: string;
}

interface DecorSearchResult {
  id: string;
  eventId: string;
  clientName: string;
  date: string;
  djCount: number;
  djAmount: number;
  coolFireCount: number;
  coolFireAmount: number;
  icePotCount: number;
  icePotAmount: number;
  confettiAmount: number;
}

export default function SearchPage() {
  // Mock data - in a real app, this would come from your data store
  const vendors = [
    { id: "VND001", name: "Elite Decorations" },
    { id: "VND002", name: "Premium Catering" },
    { id: "VND003", name: "Sound & Lights Pro" }
  ];

  const [vendorSearchForm, setVendorSearchForm] = useState({
    vendorId: "",
    dateFrom: "",
    dateTo: ""
  });

  const [decorSearchForm, setDecorSearchForm] = useState({
    dateFrom: "",
    dateTo: ""
  });

  const [vendorResults, setVendorResults] = useState<VendorSearchResult[]>([]);
  const [decorResults, setDecorResults] = useState<DecorSearchResult[]>([]);
  const [isVendorSearching, setIsVendorSearching] = useState(false);
  const [isDecorSearching, setIsDecorSearching] = useState(false);
  const [editingDecor, setEditingDecor] = useState<DecorSearchResult | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Mock vendor search results
  const mockVendorResults: VendorSearchResult[] = [
    {
      id: "PAY001",
      vendorName: "Elite Decorations",
      paymentDate: "2024-01-15",
      amount: 2500,
      purpose: "Wedding decoration setup",
      paymentChannel: "Bank Transfer"
    },
    {
      id: "PAY002",
      vendorName: "Elite Decorations", 
      paymentDate: "2024-01-20",
      amount: 1800,
      purpose: "Event lighting equipment",
      paymentChannel: "Credit Card"
    }
  ];

  // Mock decor search results
  const mockDecorResults: DecorSearchResult[] = [
    {
      id: "DCR001",
      eventId: "EVT001",
      clientName: "Sarah Johnson",
      date: "2024-01-20",
      djCount: 1,
      djAmount: 2000,
      coolFireCount: 4,
      coolFireAmount: 1200,
      icePotCount: 2,
      icePotAmount: 600,
      confettiAmount: 300
    },
    {
      id: "DCR002",
      eventId: "EVT003",
      clientName: "Mike & Anna",
      date: "2024-01-25",
      djCount: 1,
      djAmount: 1500,
      coolFireCount: 2,
      coolFireAmount: 600,
      icePotCount: 1,
      icePotAmount: 300,
      confettiAmount: 200
    }
  ];

  const handleVendorSearch = () => {
    setIsVendorSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const selectedVendor = vendors.find(v => v.id === vendorSearchForm.vendorId);
      if (selectedVendor) {
        setVendorResults(mockVendorResults.filter(result => 
          result.vendorName === selectedVendor.name
        ));
      } else {
        setVendorResults([]);
      }
      setIsVendorSearching(false);
    }, 1000);
  };

  const handleDecorSearch = () => {
    setIsDecorSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      setDecorResults(mockDecorResults);
      setIsDecorSearching(false);
    }, 1000);
  };

  const handleExportVendorData = () => {
    // Mock PDF export functionality
    alert("Vendor data exported to PDF successfully!");
  };

  const handleExportDecorData = () => {
    // Mock PDF export functionality
    alert("Decor data exported to PDF successfully!");
  };

  const handleEditDecor = (decor: DecorSearchResult) => {
    setEditingDecor(decor);
    setIsEditDialogOpen(true);
  };

  const handleSaveDecorEdit = () => {
    if (editingDecor) {
      setDecorResults(prev => 
        prev.map(item => 
          item.id === editingDecor.id ? editingDecor : item
        )
      );
      setIsEditDialogOpen(false);
      setEditingDecor(null);
    }
  };

  const vendorTotal = vendorResults.reduce((sum, result) => sum + result.amount, 0);
  const decorTotal = decorResults.reduce((sum, result) => 
    sum + result.djAmount + result.coolFireAmount + result.icePotAmount + result.confettiAmount, 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Search & Reports</h1>
        <p className="text-muted-foreground">
          Search vendor payments and decor data within date ranges
        </p>
      </div>

      {/* Search Tabs */}
      <Tabs defaultValue="vendor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vendor">Vendor Search</TabsTrigger>
          <TabsTrigger value="decor">Decor Search</TabsTrigger>
        </TabsList>

        <TabsContent value="vendor" className="space-y-6">
          {/* Vendor Search Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Vendor Payment Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendorSelect">Select Vendor</Label>
                  <Select 
                    value={vendorSearchForm.vendorId} 
                    onValueChange={(value) => setVendorSearchForm({...vendorSearchForm, vendorId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendorDateFrom">From Date</Label>
                  <Input
                    id="vendorDateFrom"
                    type="date"
                    value={vendorSearchForm.dateFrom}
                    onChange={(e) => setVendorSearchForm({...vendorSearchForm, dateFrom: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendorDateTo">To Date</Label>
                  <Input
                    id="vendorDateTo"
                    type="date"
                    value={vendorSearchForm.dateTo}
                    onChange={(e) => setVendorSearchForm({...vendorSearchForm, dateTo: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <Button 
                  onClick={handleVendorSearch}
                  disabled={!vendorSearchForm.vendorId || isVendorSearching}
                >
                  <Search className="h-4 w-4 mr-2" />
                  {isVendorSearching ? "Searching..." : "Search Payments"}
                </Button>

                {vendorResults.length > 0 && (
                  <Button variant="outline" onClick={handleExportVendorData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export to PDF
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vendor Search Results */}
          {vendorResults.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Search Results</CardTitle>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Total Amount</div>
                    <div className="text-2xl font-bold text-success">${vendorTotal.toFixed(2)}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendorResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover-lift"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{result.id}</Badge>
                          <Badge variant="outline">{result.paymentChannel}</Badge>
                        </div>
                        <div className="font-semibold">{result.vendorName}</div>
                        <div className="text-sm text-muted-foreground">{result.purpose}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {result.paymentDate}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-success">${result.amount}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {isVendorSearching && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Searching vendor payments...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="decor" className="space-y-6">
          {/* Decor Search Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Decor Data Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="decorDateFrom">From Date</Label>
                  <Input
                    id="decorDateFrom"
                    type="date"
                    value={decorSearchForm.dateFrom}
                    onChange={(e) => setDecorSearchForm({...decorSearchForm, dateFrom: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decorDateTo">To Date</Label>
                  <Input
                    id="decorDateTo"
                    type="date"
                    value={decorSearchForm.dateTo}
                    onChange={(e) => setDecorSearchForm({...decorSearchForm, dateTo: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <Button 
                  onClick={handleDecorSearch}
                  disabled={isDecorSearching}
                >
                  <Search className="h-4 w-4 mr-2" />
                  {isDecorSearching ? "Searching..." : "Search Decor Data"}
                </Button>

                {decorResults.length > 0 && (
                  <Button variant="outline" onClick={handleExportDecorData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export to PDF
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Decor Search Results */}
          {decorResults.length > 0 && (
            <>
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="metric-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Music className="h-3 w-3" />
                      DJ Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${decorResults.reduce((sum, r) => sum + r.djAmount, 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {decorResults.reduce((sum, r) => sum + r.djCount, 0)} services
                    </div>
                  </CardContent>
                </Card>

                <Card className="metric-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Cool Fire
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${decorResults.reduce((sum, r) => sum + r.coolFireAmount, 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {decorResults.reduce((sum, r) => sum + r.coolFireCount, 0)} units
                    </div>
                  </CardContent>
                </Card>

                <Card className="metric-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Snowflake className="h-3 w-3" />
                      Ice Pot
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${decorResults.reduce((sum, r) => sum + r.icePotAmount, 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {decorResults.reduce((sum, r) => sum + r.icePotCount, 0)} units
                    </div>
                  </CardContent>
                </Card>

                <Card className="metric-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Confetti
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${decorResults.reduce((sum, r) => sum + r.confettiAmount, 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total confetti cost
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Results */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Detailed Decor Data</CardTitle>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Total Value</div>
                      <div className="text-2xl font-bold text-success">${decorTotal.toFixed(2)}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {decorResults.map((result) => (
                        <div
                          key={result.id}
                          className="p-4 border rounded-lg space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary">{result.id}</Badge>
                                <Badge variant="outline">{result.eventId}</Badge>
                              </div>
                              <div className="font-semibold">{result.clientName}</div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {result.date}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditDecor(result)}
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="text-center p-2 bg-muted rounded">
                            <div className="text-xs text-muted-foreground">DJ</div>
                            <div className="font-semibold">${result.djAmount}</div>
                            <div className="text-xs">({result.djCount} service)</div>
                          </div>
                          <div className="text-center p-2 bg-muted rounded">
                            <div className="text-xs text-muted-foreground">Cool Fire</div>
                            <div className="font-semibold">${result.coolFireAmount}</div>
                            <div className="text-xs">({result.coolFireCount} units)</div>
                          </div>
                          <div className="text-center p-2 bg-muted rounded">
                            <div className="text-xs text-muted-foreground">Ice Pot</div>
                            <div className="font-semibold">${result.icePotAmount}</div>
                            <div className="text-xs">({result.icePotCount} units)</div>
                          </div>
                          <div className="text-center p-2 bg-muted rounded">
                            <div className="text-xs text-muted-foreground">Confetti</div>
                            <div className="font-semibold">${result.confettiAmount}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {isDecorSearching && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Searching decor data...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Decor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Decor Data</DialogTitle>
          </DialogHeader>
          {editingDecor && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input
                  value={editingDecor.clientName}
                  onChange={(e) => setEditingDecor({...editingDecor, clientName: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Event Date</Label>
                <Input
                  type="date"
                  value={editingDecor.date}
                  onChange={(e) => setEditingDecor({...editingDecor, date: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>DJ Count</Label>
                  <Input
                    type="number"
                    value={editingDecor.djCount}
                    onChange={(e) => setEditingDecor({...editingDecor, djCount: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>DJ Amount</Label>
                  <Input
                    type="number"
                    value={editingDecor.djAmount}
                    onChange={(e) => setEditingDecor({...editingDecor, djAmount: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cool Fire Count</Label>
                  <Input
                    type="number"
                    value={editingDecor.coolFireCount}
                    onChange={(e) => setEditingDecor({...editingDecor, coolFireCount: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cool Fire Amount</Label>
                  <Input
                    type="number"
                    value={editingDecor.coolFireAmount}
                    onChange={(e) => setEditingDecor({...editingDecor, coolFireAmount: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ice Pot Count</Label>
                  <Input
                    type="number"
                    value={editingDecor.icePotCount}
                    onChange={(e) => setEditingDecor({...editingDecor, icePotCount: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ice Pot Amount</Label>
                  <Input
                    type="number"
                    value={editingDecor.icePotAmount}
                    onChange={(e) => setEditingDecor({...editingDecor, icePotAmount: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Confetti Amount</Label>
                <Input
                  type="number"
                  value={editingDecor.confettiAmount}
                  onChange={(e) => setEditingDecor({...editingDecor, confettiAmount: parseInt(e.target.value) || 0})}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveDecorEdit}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}