'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { approvalWorkflows, users } from '@/lib/mock-data-users';
import { ApprovalWorkflow, ApprovalStatus } from '@/lib/types';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  DollarSign,
  User,
  Calendar,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

export default function ApprovalsPage() {
  // In a real app, this would come from auth context
  const currentUserId = 'U003'; // Usman Abdullahi (Finance Officer)
  const currentUser = users.find(u => u.id === currentUserId);

  const [selectedWorkflow, setSelectedWorkflow] = useState<ApprovalWorkflow | null>(null);
  const [comment, setComment] = useState('');

  // Get workflows where current user is an approver
  const myWorkflows = approvalWorkflows.filter(workflow => {
    return workflow.approvals.some(approval => approval.approverId === currentUserId);
  });

  const pendingWorkflows = myWorkflows.filter(w => {
    const myApproval = w.approvals.find(a => a.approverId === currentUserId);
    return myApproval?.status === 'Pending' && w.status === 'Pending';
  });

  const completedWorkflows = myWorkflows.filter(w => {
    const myApproval = w.approvals.find(a => a.approverId === currentUserId);
    return myApproval?.status !== 'Pending';
  });

  const handleApprove = () => {
    if (!selectedWorkflow) return;
    console.log('Approving:', selectedWorkflow.id, 'with comment:', comment);
    setSelectedWorkflow(null);
    setComment('');
  };

  const handleReject = () => {
    if (!selectedWorkflow) return;
    console.log('Rejecting:', selectedWorkflow.id, 'with comment:', comment);
    setSelectedWorkflow(null);
    setComment('');
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    const config = {
      Pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
      Approved: { icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-300' },
      Rejected: { icon: XCircle, color: 'bg-red-100 text-red-700 border-red-300' },
    };
    const { icon: Icon, color } = config[status];
    return (
      <Badge variant="outline" className={`${color} gap-1`}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const WorkflowCard = ({ workflow }: { workflow: ApprovalWorkflow }) => {
    const currentStep = workflow.approvals[workflow.currentLevel - 1];
    const isMyTurn = currentStep?.approverId === currentUserId && currentStep.status === 'Pending';

    return (
      <Card
        className={`border-brand/20 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
          isMyTurn ? 'border-l-4 border-l-brand' : ''
        }`}
        onClick={() => setSelectedWorkflow(workflow)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-brand mb-1">{workflow.requestTitle}</h3>
              <p className="text-xs text-muted-foreground">
                Requested by {workflow.requestedByName}
              </p>
            </div>
            {getStatusBadge(workflow.status)}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-brand" />
              <span className="font-medium">₦{workflow.amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-brand" />
              <span>{new Date(workflow.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Approval Progress */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Progress:</span>
              <span className="font-medium text-brand">
                Level {workflow.currentLevel} of {workflow.totalLevels}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {workflow.approvals.map((approval, idx) => (
                <div key={idx} className="flex-1 flex items-center">
                  <div
                    className={`h-2 rounded-full flex-1 ${
                      approval.status === 'Approved'
                        ? 'bg-green-500'
                        : approval.status === 'Rejected'
                        ? 'bg-red-500'
                        : approval.approverId === currentUserId
                        ? 'bg-brand'
                        : 'bg-gray-200'
                    }`}
                  />
                  {idx < workflow.approvals.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-gray-400 mx-0.5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {isMyTurn && (
            <div className="mt-3 pt-3 border-t border-brand/20">
              <p className="text-xs font-medium text-brand flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Your approval required
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const WorkflowDetail = ({ workflow }: { workflow: ApprovalWorkflow }) => {
    const myApproval = workflow.approvals.find(a => a.approverId === currentUserId);
    const canApprove = myApproval?.status === 'Pending' && workflow.status === 'Pending';
    const exceedsLimit = currentUser && workflow.amount > currentUser.approvalLimit;

    return (
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-brand">{workflow.requestTitle}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Request ID: {workflow.requestId}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSelectedWorkflow(null)}>
            Close
          </Button>
        </div>

        {/* Request Details */}
        <Card className="border-brand/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-brand text-base">Request Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Type</p>
                <Badge className="bg-brand/10 text-brand">{workflow.type}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Amount</p>
                <p className="text-lg font-bold text-brand">₦{workflow.amount.toLocaleString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Requested By</p>
                <p className="text-sm font-medium">{workflow.requestedByName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date</p>
                <p className="text-sm font-medium">{new Date(workflow.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approval Chain */}
        <Card className="border-brand/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-brand text-base">Approval Chain</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workflow.approvals.map((approval, idx) => {
              const initials = approval.approverName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase();
              const isMe = approval.approverId === currentUserId;

              return (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <Avatar className={`h-8 w-8 ${isMe ? 'ring-2 ring-brand' : ''}`}>
                      <AvatarFallback className={isMe ? 'bg-brand text-white' : 'bg-gray-200'}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {idx < workflow.approvals.length - 1 && (
                      <div className="w-0.5 h-full min-h-8 bg-gray-200 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <p className="text-sm font-medium">
                          {approval.approverName}
                          {isMe && <span className="text-brand ml-1">(You)</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">{approval.approverRole}</p>
                      </div>
                      {getStatusBadge(approval.status)}
                    </div>
                    {approval.comments && (
                      <div className="mt-2 p-2 bg-brand/5 rounded-md">
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                          <MessageSquare className="h-3 w-3" />
                          Comment
                        </p>
                        <p className="text-sm">{approval.comments}</p>
                      </div>
                    )}
                    {approval.approvedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(approval.approvedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Action Section */}
        {canApprove && (
          <Card className="border-brand/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-brand text-base">Your Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {exceedsLimit && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Approval Limit Exceeded</p>
                    <p className="text-yellow-700">
                      This amount (₦{workflow.amount.toLocaleString()}) exceeds your approval limit of ₦
                      {currentUser.approvalLimit.toLocaleString()}. You can still approve, but it may require
                      additional approval.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="comment">Comments (Optional)</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your comments here..."
                  className="border-brand/30 focus:border-brand"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleApprove}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  onClick={handleReject}
                  variant="destructive"
                  className="flex-1 gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand">Approvals</h1>
          <p className="text-muted-foreground mt-1">
            Review and approve payment requests and other workflows
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-brand/20 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-brand">Pending My Action</CardTitle>
              <Clock className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold text-gray-900">{pendingWorkflows.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting your approval</p>
            </CardContent>
          </Card>

          <Card className="border-brand/20 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-brand">Completed</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold text-gray-900">{completedWorkflows.length}</div>
              <p className="text-xs text-muted-foreground">You've reviewed</p>
            </CardContent>
          </Card>

          <Card className="border-brand/20 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-brand">Approval Limit</CardTitle>
              <DollarSign className="h-5 w-5 text-brand" />
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold text-gray-900">
                {currentUser?.approvalLimit === 0
                  ? 'None'
                  : `₦${(currentUser?.approvalLimit || 0) / 1000}K`
                }
              </div>
              <p className="text-xs text-muted-foreground">Your maximum approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* List */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="pending">
                  Pending ({pendingWorkflows.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedWorkflows.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pending" className="space-y-3">
                {pendingWorkflows.length === 0 ? (
                  <Card className="border-brand/20">
                    <CardContent className="p-8 text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-brand mb-1">All caught up!</h3>
                      <p className="text-sm text-muted-foreground">
                        No pending approvals at the moment
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  pendingWorkflows.map((workflow) => (
                    <WorkflowCard key={workflow.id} workflow={workflow} />
                  ))
                )}
              </TabsContent>
              <TabsContent value="completed" className="space-y-3">
                {completedWorkflows.length === 0 ? (
                  <Card className="border-brand/20">
                    <CardContent className="p-8 text-center">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-brand mb-1">No completed approvals</h3>
                      <p className="text-sm text-muted-foreground">
                        Completed approvals will appear here
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  completedWorkflows.map((workflow) => (
                    <WorkflowCard key={workflow.id} workflow={workflow} />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Detail */}
          <div className="lg:col-span-3">
            {selectedWorkflow ? (
              <WorkflowDetail workflow={selectedWorkflow} />
            ) : (
              <Card className="border-brand/20 h-full">
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[500px]">
                  <CheckCircle className="h-16 w-16 text-brand/30 mb-4" />
                  <h3 className="text-lg font-semibold text-brand mb-2">Select an approval</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-sm">
                    Click on any approval request from the list to view details and take action
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
