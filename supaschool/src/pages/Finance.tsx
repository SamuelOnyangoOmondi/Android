import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SchoolFilter } from "@/components/shared/SchoolFilter";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  CreditCard,
  Wallet,
  Plus,
  Download,
} from "lucide-react";

const demoTransactions = [
  { id: "1", desc: "School fees - Term 1", amount: 125000, type: "income", date: "2026-03-01" },
  { id: "2", desc: "Stationery supplies", amount: 15000, type: "expense", date: "2026-03-02" },
  { id: "3", desc: "PTA contribution", amount: 45000, type: "income", date: "2026-03-03" },
  { id: "4", desc: "Maintenance - Block B", amount: 22000, type: "expense", date: "2026-03-04" },
  { id: "5", desc: "Transport subsidy", amount: 8000, type: "expense", date: "2026-03-05" },
];

const demoBudget = [
  { category: "Salaries", allocated: 450000, spent: 420000, percent: 93 },
  { category: "Utilities", allocated: 35000, spent: 28000, percent: 80 },
  { category: "Supplies", allocated: 50000, spent: 15000, percent: 30 },
  { category: "Maintenance", allocated: 40000, spent: 22000, percent: 55 },
];

export default function FinancePage() {
  const [schoolId, setSchoolId] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(n);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2 bg-gradient-to-r from-emerald-600 to-green-800 p-6 rounded-xl shadow-md border border-emerald-500/30">
          <h1 className="text-2xl font-bold tracking-tight text-white">Finance</h1>
          <p className="text-white/80 max-w-2xl">
            Track income, expenses, budgets, and fees. Generate financial reports and reconcile accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">School</CardTitle>
              </CardHeader>
              <CardContent>
                <SchoolFilter value={schoolId} onValueChange={setSchoolId} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Quick actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" disabled={!schoolId}>
                  <Plus className="h-4 w-4 mr-2" />
                  Record transaction
                </Button>
                <Button variant="outline" className="w-full" disabled={!schoolId}>
                  <Receipt className="h-4 w-4 mr-2" />
                  Add expense
                </Button>
                <Button variant="outline" className="w-full" disabled={!schoolId}>
                  <Download className="h-4 w-4 mr-2" />
                  Export report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">This month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" /> Income
                  </span>
                  <span className="font-medium">{formatCurrency(170000)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-600 flex items-center gap-1">
                    <TrendingDown className="h-4 w-4" /> Expenses
                  </span>
                  <span className="font-medium">{formatCurrency(45000)}</span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Net</span>
                  <span className="font-bold text-green-600">{formatCurrency(125000)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {!schoolId ? (
              <EmptyState
                icon={DollarSign}
                title="Select a school"
                description="Choose a school to view and manage finances."
              />
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="transactions" className="flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    <span>Transactions</span>
                  </TabsTrigger>
                  <TabsTrigger value="budget" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Budget</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Balance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-600">{formatCurrency(125000)}</div>
                        <p className="text-sm text-muted-foreground mt-1">Current term</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Income (MTD)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{formatCurrency(170000)}</div>
                        <p className="text-sm text-muted-foreground mt-1">Month to date</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Expenses (MTD)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{formatCurrency(45000)}</div>
                        <p className="text-sm text-muted-foreground mt-1">Month to date</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Financial summary</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Add Supabase tables for transactions, budgets, and fee records to persist data.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border p-4 bg-muted/30">
                        <p className="text-sm">
                          Recommended schema: <code className="text-xs bg-muted px-1 rounded">transactions</code>,{" "}
                          <code className="text-xs bg-muted px-1 rounded">budgets</code>,{" "}
                          <code className="text-xs bg-muted px-1 rounded">fee_payments</code>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="transactions" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent transactions</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Sample data. Connect to Supabase when ready.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Amount</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {demoTransactions.map((t) => (
                              <tr key={t.id} className="bg-white">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.desc}</td>
                                <td className="px-4 py-3">
                                  <Badge variant={t.type === "income" ? "secondary" : "outline"}>
                                    {t.type}
                                  </Badge>
                                </td>
                                <td
                                  className={`px-4 py-3 text-sm text-right font-medium ${
                                    t.type === "income" ? "text-green-600" : "text-red-600"
                                  }`}
                                >
                                  {t.type === "income" ? "+" : "-"}
                                  {formatCurrency(t.amount)}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">{t.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="budget" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Budget allocation</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Track spending against allocated budgets per category.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Allocated</th>
                              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Spent</th>
                              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">%</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {demoBudget.map((b) => (
                              <tr key={b.category} className="bg-white">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{b.category}</td>
                                <td className="px-4 py-3 text-sm text-right text-gray-500">
                                  {formatCurrency(b.allocated)}
                                </td>
                                <td className="px-4 py-3 text-sm text-right text-gray-500">
                                  {formatCurrency(b.spent)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <Badge variant={b.percent > 90 ? "destructive" : "secondary"}>
                                    {b.percent}%
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
