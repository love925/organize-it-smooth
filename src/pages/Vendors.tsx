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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Trash2, 
  Users,
  Phone,
  DollarSign,
  Calendar,
  CreditCard,
  Building
} from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  contactNumber: string;
  totalPaid: number;
  paymentsCount: number;
}

interface Payment {
  id: string;
  vendorId: string;
  vendorName: string;
  date: string;
  amount: number;
  purpose: string;
  paymentChannel: string;
}

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: "VND001",
      name: "Elite Decorations",
      contactNumber: "+1-555-0123",
      totalPaid: 15000,
      paymentsCount: 8
    },
    {
      id: "VND002",
      name: "Premium Catering",
      contactNumber: "+1-555-0456",
      totalPaid: 8500,
      paymentsCount: 5
    },
    {
      id: "VND003",
      name: "Sound & Lights Pro",
      contactNumber: "+1-555-0789",
      totalPaid: 12000,
      paymentsCount: 6
    }
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "PAY001",
      vendorId: "VND001",
      vendorName: "Elite Decorations",
      date: "2024-01-15",
      amount: 2500,
      purpose: "Wedding decoration setup",
      paymentChannel: "Bank Transfer"
    },
    {
      id: "PAY002",
      vendorId: "VND002", 
      vendorName: "Premium Catering",
      date: "2024-01-18",
      amount: 1800,
      purpose: "Corporate event catering",
      paymentChannel: "Credit Card"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isVendorDialogOpen, setIsVendorDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const [vendorFormData, setVendorFormData] = useState({
    name: "",
    contactNumber: ""
  });

  const [paymentFormData, setPaymentFormData] = useState({
    vendorId: "",
    date: "",
    amount: "",
    purpose: "",
    paymentChannel: ""
  });

  const paymentChannels = [
    "Cash",
    "Bank Transfer", 
    "Credit Card",
    "Debit Card",
    "Digital Wallet",
    "Check"
  ];

  const generateVendorId = () => {
    const vendorCount = vendors.length + 1;
    return `VND${vendorCount.toString().padStart(3, '0')}`;
  };

  const generatePaymentId = () => {
    const paymentCount = payments.length + 1;
    return `PAY${paymentCount.toString().padStart(3, '0')}`;
  };

  const handleVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newVendor: Vendor = {
      id: generateVendorId(),
      name: vendorFormData.name,
      contactNumber: vendorFormData.contactNumber,
      totalPaid: 0,
      paymentsCount: 0
    };
    
    setVendors(prev => [...prev, newVendor]);
    
    // Reset form
    setVendorFormData({
      name: "",
      contactNumber: ""
    });
    setIsVendorDialogOpen(false);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const vendor = vendors.find(v => v.id === paymentFormData.vendorId);
    if (!vendor) return;
    
    const newPayment: Payment = {
      id: generatePaymentId(),
      vendorId: paymentFormData.vendorId,
      vendorName: vendor.name,
      date: paymentFormData.date,
      amount: parseFloat(paymentFormData.amount),
      purpose: paymentFormData.purpose,
      paymentChannel: paymentFormData.paymentChannel
    };
    
    setPayments(prev => [...prev, newPayment]);
    
    // Update vendor totals
    setVendors(prev => prev.map(v => 
      v.id === paymentFormData.vendorId 
        ? { 
            ...v, 
            totalPaid: v.totalPaid + parseFloat(paymentFormData.amount),
            paymentsCount: v.paymentsCount + 1 
          }
        : v
    ));
    
    // Reset form
    setPaymentFormData({
      vendorId: "",
      date: "",
      amount: "",
      purpose: "",
      paymentChannel: ""
    });
    setIsPaymentDialogOpen(false);
  };

  const handleDeleteVendor = (id: string) => {
    setVendors(prev => prev.filter(vendor => vendor.id !== id));
    // Also remove all payments for this vendor
    setPayments(prev => prev.filter(payment => payment.vendorId !== id));
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contactNumber.includes(searchTerm)
  );

  const filteredPayments = payments.filter(payment =>
    payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.date.includes(searchTerm)
  );

  const totalVendors = vendors.length;
  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
  const averagePayment = payments.length > 0 ? totalPayments / payments.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Management</h1>
          <p className="text-muted-foreground">
            Manage vendors and track payments
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Vendors
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalVendors}
            </div>
            <div className="text-xs text-muted-foreground">
              Active vendor relationships
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Payments
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              ${totalPayments.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              Total amount paid to vendors
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Payment
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20">
              <CreditCard className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              ${averagePayment.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              Per transaction average
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Vendors and Payments */}
      <Tabs defaultValue="vendors" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="space-y-4">
          {/* Vendor Management */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Dialog open={isVendorDialogOpen} onOpenChange={setIsVendorDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vendor
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Vendor</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleVendorSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendorName">Vendor Name</Label>
                    <Input
                      id="vendorName"
                      value={vendorFormData.name}
                      onChange={(e) => setVendorFormData({...vendorFormData, name: e.target.value})}
                      placeholder="Enter vendor name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      id="contactNumber"
                      value={vendorFormData.contactNumber}
                      onChange={(e) => setVendorFormData({...vendorFormData, contactNumber: e.target.value})}
                      placeholder="Enter contact number"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsVendorDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Add Vendor
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Vendors List */}
          <div className="grid gap-4">
            {filteredVendors.map((vendor) => (
              <Card key={vendor.id} className="hover-lift">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{vendor.id}</Badge>
                      </div>
                      
                      <h3 className="text-xl font-semibold">{vendor.name}</h3>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {vendor.contactNumber}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          Total Paid: ${vendor.totalPaid}
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          {vendor.paymentsCount} payments
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteVendor(vendor.id)}
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

            {filteredVendors.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No vendors found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? "Try adjusting your search terms" : "Add your first vendor to get started"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {/* Payment Management */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Record Vendor Payment</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vendorSelect">Vendor</Label>
                      <Select 
                        value={paymentFormData.vendorId} 
                        onValueChange={(value) => setPaymentFormData({...paymentFormData, vendorId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select vendor" />
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
                      <Label htmlFor="paymentDate">Date</Label>
                      <Input
                        id="paymentDate"
                        type="date"
                        value={paymentFormData.date}
                        onChange={(e) => setPaymentFormData({...paymentFormData, date: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentAmount">Amount ($)</Label>
                      <Input
                        id="paymentAmount"
                        type="number"
                        step="0.01"
                        value={paymentFormData.amount}
                        onChange={(e) => setPaymentFormData({...paymentFormData, amount: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentChannel">Payment Channel</Label>
                      <Select 
                        value={paymentFormData.paymentChannel} 
                        onValueChange={(value) => setPaymentFormData({...paymentFormData, paymentChannel: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentChannels.map((channel) => (
                            <SelectItem key={channel} value={channel}>
                              {channel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentPurpose">Purpose</Label>
                    <Textarea
                      id="paymentPurpose"
                      value={paymentFormData.purpose}
                      onChange={(e) => setPaymentFormData({...paymentFormData, purpose: e.target.value})}
                      placeholder="What was this payment for?"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsPaymentDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Record Payment
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Payments List */}
          <div className="grid gap-4">
            {filteredPayments.map((payment) => (
              <Card key={payment.id} className="hover-lift">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{payment.id}</Badge>
                        <Badge variant="outline">{payment.paymentChannel}</Badge>
                      </div>
                      
                      <h3 className="text-xl font-semibold">{payment.vendorName}</h3>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {payment.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {payment.purpose}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-success">
                        ${payment.amount}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        via {payment.paymentChannel}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredPayments.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No payments found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? "Try adjusting your search terms" : "Record your first payment to get started"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}