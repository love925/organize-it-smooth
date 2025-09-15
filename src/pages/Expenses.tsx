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
  Receipt,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface Expense {
  id: string;
  date: string;
  cashInHand: number;
  purpose: string;
  amount: number;
  type: 'expense' | 'asset';
  comment: string;
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "EXP001",
      date: "2024-01-15",
      cashInHand: 5000,
      purpose: "Sound System Rental",
      amount: 800,
      type: "expense",
      comment: "Premium sound system for wedding event"
    },
    {
      id: "EXP002", 
      date: "2024-01-18",
      cashInHand: 4200,
      purpose: "LED Lights Purchase",
      amount: 1200,
      type: "asset",
      comment: "Investment in new LED lighting equipment"
    },
    {
      id: "EXP003",
      date: "2024-01-20",
      cashInHand: 3000,
      purpose: "Decoration Supplies",
      amount: 450,
      type: "expense",
      comment: "Flowers and fabric for Sarah's wedding"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [formData, setFormData] = useState({
    date: "",
    cashInHand: "",
    purpose: "",
    amount: "",
    type: "expense" as 'expense' | 'asset',
    comment: ""
  });

  const expenseTypes = [
    { value: "expense", label: "Expense" },
    { value: "asset", label: "Asset" }
  ];

  const generateExpenseId = () => {
    const expenseCount = expenses.length + 1;
    return `EXP${expenseCount.toString().padStart(3, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingExpense) {
      setExpenses(prev => prev.map(expense => 
        expense.id === editingExpense.id 
          ? { 
              ...expense, 
              ...formData,
              cashInHand: parseFloat(formData.cashInHand),
              amount: parseFloat(formData.amount)
            }
          : expense
      ));
    } else {
      const newExpense: Expense = {
        id: generateExpenseId(),
        ...formData,
        cashInHand: parseFloat(formData.cashInHand),
        amount: parseFloat(formData.amount)
      };
      setExpenses(prev => [...prev, newExpense]);
    }

    // Reset form
    setFormData({
      date: "",
      cashInHand: "",
      purpose: "",
      amount: "",
      type: "expense",
      comment: ""
    });
    setEditingExpense(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      date: expense.date,
      cashInHand: expense.cashInHand.toString(),
      purpose: expense.purpose,
      amount: expense.amount.toString(),
      type: expense.type,
      comment: expense.comment
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const filteredExpenses = expenses.filter(expense =>
    expense.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.date.includes(searchTerm)
  );

  // Calculate totals
  const totalExpenses = expenses
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const totalAssets = expenses
    .filter(e => e.type === 'asset')
    .reduce((sum, e) => sum + e.amount, 0);

  const currentCash = expenses.length > 0 
    ? expenses[expenses.length - 1].cashInHand 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense Management</h1>
          <p className="text-muted-foreground">
            Track your business expenses and asset purchases
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingExpense(null);
              setFormData({
                date: "",
                cashInHand: "",
                purpose: "",
                amount: "",
                type: "expense",
                comment: ""
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Record Expense
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingExpense ? "Edit Expense" : "Record New Expense"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="cashInHand">Cash in Hand ($)</Label>
                  <Input
                    id="cashInHand"
                    type="number"
                    step="0.01"
                    value={formData.cashInHand}
                    onChange={(e) => setFormData({...formData, cashInHand: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: 'expense' | 'asset') => setFormData({...formData, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  placeholder="What was this expense for?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Comments</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  placeholder="Additional details about this expense"
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
                  {editingExpense ? "Update Expense" : "Record Expense"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/20">
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalExpenses.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              Total operational expenses
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Asset Investments
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${totalAssets.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              Equipment and assets
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Cash
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              ${currentCash.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              Available cash balance
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, purpose, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <div className="grid gap-4">
        {filteredExpenses.map((expense) => (
          <Card key={expense.id} className="hover-lift">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{expense.id}</Badge>
                    <Badge 
                      variant={expense.type === "asset" ? "default" : "outline"}
                      className={expense.type === "expense" ? "text-red-600" : "text-blue-600"}
                    >
                      {expense.type}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold">{expense.purpose}</h3>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {expense.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Cash in Hand: ${expense.cashInHand}
                    </div>
                  </div>
                  
                  {expense.comment && (
                    <div className="max-w-lg">
                      <p className="text-sm text-muted-foreground">{expense.comment}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      expense.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {expense.type === 'expense' ? '-' : '+'}${expense.amount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {expense.type === 'expense' ? 'Expense' : 'Asset Investment'}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(expense)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(expense.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredExpenses.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No expenses found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Try adjusting your search terms" : "Record your first expense to get started"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}