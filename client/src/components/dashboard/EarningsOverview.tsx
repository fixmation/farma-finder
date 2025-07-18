
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Calendar, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Transaction {
  id: string;
  amount_lkr: number;
  transaction_date: string;
  description: string;
  status: string;
}

interface EarningsOverviewProps {
  pharmacyId?: string;
  totalEarnings: number;
}

export const EarningsOverview: React.FC<EarningsOverviewProps> = ({ 
  pharmacyId, 
  totalEarnings 
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pharmacyId) {
      fetchTransactions();
    }
  }, [pharmacyId]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('commission_transactions')
        .select('*')
        .eq('pharmacy_id', pharmacyId)
        .order('transaction_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-LK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMonthlyEarnings = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(t => {
        const transDate = new Date(t.transaction_date);
        return transDate.getMonth() === currentMonth && 
               transDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + Number(t.amount_lkr), 0);
  };

  const getWeeklyEarnings = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return transactions
      .filter(t => new Date(t.transaction_date) >= oneWeekAgo)
      .reduce((sum, t) => sum + Number(t.amount_lkr), 0);
  };

  if (!pharmacyId) {
    return (
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Complete your pharmacy registration to view earnings
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Earnings Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">LKR {totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All time earnings
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">LKR {getMonthlyEarnings().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Current month earnings
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">LKR {getWeeklyEarnings().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
          <CardDescription>
            Your latest commission earnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No transactions yet.</p>
              <p className="text-sm">Start processing prescriptions to earn commissions!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">
                      {transaction.description || 'Prescription Processing Commission'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.transaction_date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      +LKR {Number(transaction.amount_lkr).toLocaleString()}
                    </p>
                    <Badge variant={
                      transaction.status === 'completed' ? 'default' : 'secondary'
                    }>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
