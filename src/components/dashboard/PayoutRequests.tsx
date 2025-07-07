
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Clock, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PayoutRequest {
  id: string;
  requested_amount: number;
  payment_method: string;
  payment_details: any;
  status: string;
  requested_at: string;
  processed_at: string | null;
  notes: string | null;
}

interface PayoutRequestsProps {
  pharmacyId?: string;
  availableBalance: number;
}

export const PayoutRequests: React.FC<PayoutRequestsProps> = ({ 
  pharmacyId, 
  availableBalance 
}) => {
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  
  const [requestForm, setRequestForm] = useState({
    amount: '',
    paymentMethod: '',
    bankAccount: '',
    accountName: '',
    bankName: '',
    branchCode: '',
    lankaQRNumber: ''
  });

  useEffect(() => {
    if (pharmacyId) {
      fetchPayoutRequests();
    }
  }, [pharmacyId]);

  const fetchPayoutRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('pharmacy_id', pharmacyId)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setPayoutRequests(data || []);
    } catch (error) {
      console.error('Error fetching payout requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitPayoutRequest = async () => {
    try {
      setRequesting(true);
      
      const amount = parseFloat(requestForm.amount);
      if (amount <= 0 || amount > availableBalance) {
        toast.error('Invalid amount requested');
        return;
      }

      const paymentDetails = requestForm.paymentMethod === 'lankaqr' ? {
        lankaQRNumber: requestForm.lankaQRNumber
      } : {
        bankAccount: requestForm.bankAccount,
        accountName: requestForm.accountName,
        bankName: requestForm.bankName,
        branchCode: requestForm.branchCode
      };

      const { error } = await supabase
        .from('payout_requests')
        .insert({
          pharmacy_id: pharmacyId,
          requested_amount: amount,
          payment_method: requestForm.paymentMethod,
          payment_details: paymentDetails,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Payout request submitted successfully');
      setShowRequestForm(false);
      setRequestForm({
        amount: '',
        paymentMethod: '',
        bankAccount: '',
        accountName: '',
        bankName: '',
        branchCode: '',
        lankaQRNumber: ''
      });
      fetchPayoutRequests();
    } catch (error: any) {
      console.error('Error submitting payout request:', error);
      toast.error('Failed to submit payout request');
    } finally {
      setRequesting(false);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  if (!pharmacyId) {
    return (
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Complete your pharmacy registration to request payouts
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Available Balance */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Available Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600">
                LKR {availableBalance.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                Ready for withdrawal
              </p>
            </div>
            <Button 
              onClick={() => setShowRequestForm(true)}
              disabled={availableBalance <= 0}
            >
              Request Payout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payout Request Form */}
      {showRequestForm && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Request Payout</CardTitle>
            <CardDescription>
              Submit a payout request for your earnings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (LKR)</Label>
              <Input
                id="amount"
                type="number"
                max={availableBalance}
                value={requestForm.amount}
                onChange={(e) => setRequestForm({ ...requestForm, amount: e.target.value })}
                placeholder={`Max: ${availableBalance}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select 
                value={requestForm.paymentMethod} 
                onValueChange={(value) => setRequestForm({ ...requestForm, paymentMethod: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lankaqr">LankaQR</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {requestForm.paymentMethod === 'lankaqr' && (
              <div className="space-y-2">
                <Label htmlFor="lankaqr-number">LankaQR Number</Label>
                <Input
                  id="lankaqr-number"
                  value={requestForm.lankaQRNumber}
                  onChange={(e) => setRequestForm({ ...requestForm, lankaQRNumber: e.target.value })}
                  placeholder="Enter your LankaQR number"
                />
              </div>
            )}

            {requestForm.paymentMethod === 'bank_transfer' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-name">Account Name</Label>
                    <Input
                      id="account-name"
                      value={requestForm.accountName}
                      onChange={(e) => setRequestForm({ ...requestForm, accountName: e.target.value })}
                      placeholder="Account holder name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank-account">Account Number</Label>
                    <Input
                      id="bank-account"
                      value={requestForm.bankAccount}
                      onChange={(e) => setRequestForm({ ...requestForm, bankAccount: e.target.value })}
                      placeholder="Bank account number"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank-name">Bank Name</Label>
                    <Input
                      id="bank-name"
                      value={requestForm.bankName}
                      onChange={(e) => setRequestForm({ ...requestForm, bankName: e.target.value })}
                      placeholder="Bank name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch-code">Branch Code</Label>
                    <Input
                      id="branch-code"
                      value={requestForm.branchCode}
                      onChange={(e) => setRequestForm({ ...requestForm, branchCode: e.target.value })}
                      placeholder="Branch code"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={submitPayoutRequest} disabled={requesting}>
                {requesting ? 'Submitting...' : 'Submit Request'}
              </Button>
              <Button variant="outline" onClick={() => setShowRequestForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payout Requests History */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payout History
          </CardTitle>
          <CardDescription>
            Your payout request history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading payout requests...</div>
          ) : payoutRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No payout requests yet.</p>
              <p className="text-sm">Request your first payout when you have available balance!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payoutRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <p className="font-medium">
                        LKR {Number(request.requested_amount).toLocaleString()}
                      </p>
                      <Badge variant={
                        request.status === 'completed' ? 'default' :
                        request.status === 'processing' ? 'secondary' :
                        request.status === 'failed' ? 'destructive' : 'secondary'
                      }>
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {request.payment_method === 'lankaqr' ? 'LankaQR' : 'Bank Transfer'} • 
                      Requested on {formatDate(request.requested_at)}
                    </p>
                    {request.notes && (
                      <p className="text-sm text-muted-foreground">
                        Note: {request.notes}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {request.processed_at && (
                      <p className="text-sm text-muted-foreground">
                        Processed: {formatDate(request.processed_at)}
                      </p>
                    )}
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
