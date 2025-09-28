import React, { useState } from 'react';
import { Send, Bell, Calendar, User, Users, Filter, Search, Gift, CheckCircle, PlusCircle, Trash2, Star, Target, Eye, Smartphone, Clock, Palette, Timer, AlertTriangle, Zap } from 'lucide-react';
import { AdvancedUserSelector } from './AdvancedUserSelector';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { mockNotifications, mockUsers, type Notification } from '../data/mockData';

type OfferNotification = {
  id: string;
  title: string;
  description: string;
  type: 'survey' | 'task';
  reward: {
    type: 'coins' | 'points' | 'rupees';
    amount: number;
  };
  expiryDate: string;
  status: 'active' | 'draft' | 'expired';
  targetAudience: string;
  colorScheme: 'blue-purple' | 'green-teal' | 'orange-red' | 'purple-pink' | 'dark-gold' | 'rainbow';
  urgency: 'low' | 'normal' | 'high' | 'urgent';
  displayDuration: '1h' | '6h' | '12h' | '24h' | '48h' | '7d' | 'until-completed';
  autoReminder: boolean;
  reminderInterval: '1h' | '6h' | '12h' | '24h' | '48h';
  questions?: SurveyQuestion[];
  taskRequirements?: TaskRequirement[];
  responses?: number;
  completions?: number;
  createdDate: string;
};

type SurveyQuestion = {
  id: string;
  type: 'multiple-choice' | 'text' | 'rating' | 'yes-no';
  question: string;
  options?: string[];
  required: boolean;
};

type TaskRequirement = {
  id: string;
  title: string;
  description: string;
  type: 'action' | 'verification' | 'sharing';
  required: boolean;
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [offerNotifications, setOfferNotifications] = useState<OfferNotification[]>([
    {
      id: 'offer-1',
      title: 'Complete Profile Survey',
      description: 'Help us improve your experience by completing this quick survey about your preferences.',
      type: 'survey',
      reward: { type: 'coins', amount: 50 },
      expiryDate: '2024-10-15',
      status: 'active',
      targetAudience: 'All Users',
      colorScheme: 'blue-purple',
      urgency: 'normal',
      displayDuration: '24h',
      autoReminder: true,
      reminderInterval: '12h',
      questions: [
        { id: 'q1', type: 'multiple-choice', question: 'What type of advertising interests you most?', options: ['Outdoor', 'Online', 'Print', 'Radio'], required: true },
        { id: 'q2', type: 'rating', question: 'Rate your satisfaction with our platform', required: true }
      ],
      responses: 127,
      completions: 89,
      createdDate: '2024-09-15'
    },
    {
      id: 'offer-2',
      title: 'Refer a Friend Challenge',
      description: 'Invite friends to join WallPe and earn rewards for each successful referral.',
      type: 'task',
      reward: { type: 'rupees', amount: 100 },
      expiryDate: '2024-11-01',
      status: 'active',
      targetAudience: 'Premium Users',
      colorScheme: 'green-teal',
      urgency: 'high',
      displayDuration: 'until-completed',
      autoReminder: false,
      reminderInterval: '24h',
      taskRequirements: [
        { id: 't1', title: 'Share referral link', description: 'Share your unique referral link with friends', type: 'sharing', required: true },
        { id: 't2', title: 'Friend signs up', description: 'Your friend must complete registration', type: 'verification', required: true }
      ],
      responses: 45,
      completions: 23,
      createdDate: '2024-09-20'
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  // New notification form state
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    scheduleType: 'now' as 'now' | 'later',
    scheduleDate: ''
  });

  // User selection state for general notifications
  const [userSelection, setUserSelection] = useState({
    type: 'all' as 'individual' | 'group' | 'criteria' | 'all',
    userIds: [] as string[],
    groupIds: [] as string[],
    criteria: {},
    estimatedCount: 0
  });

  // User selection state for offer notifications
  const [offerUserSelection, setOfferUserSelection] = useState({
    type: 'all' as 'individual' | 'group' | 'criteria' | 'all',
    userIds: [] as string[],
    groupIds: [] as string[],
    criteria: {},
    estimatedCount: 0
  });

  // New offer notification form state
  const [newOfferNotification, setNewOfferNotification] = useState({
    title: '',
    description: '',
    type: 'survey' as 'survey' | 'task',
    rewardType: 'coins' as 'coins' | 'points' | 'rupees',
    rewardAmount: 50,
    expiryDate: '',
    targetAudience: 'all' as 'all' | 'premium' | 'new' | 'active',
    colorScheme: 'blue-purple' as 'blue-purple' | 'green-teal' | 'orange-red' | 'purple-pink' | 'dark-gold' | 'rainbow',
    urgency: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    displayDuration: '24h' as '1h' | '6h' | '12h' | '24h' | '48h' | '7d' | 'until-completed',
    autoReminder: false,
    reminderInterval: '24h' as '1h' | '6h' | '12h' | '24h' | '48h',
    questions: [{ id: '1', type: 'text' as const, question: '', options: [], required: true }] as SurveyQuestion[],
    taskRequirements: [{ id: '1', title: '', description: '', type: 'action' as const, required: true }] as TaskRequirement[]
  });

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = !searchQuery || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.recipient.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleSendNotification = () => {
    if (!newNotification.title || !newNotification.message) return;

    let recipient = '';
    switch (userSelection.type) {
      case 'all':
        recipient = `All Users (${userSelection.estimatedCount.toLocaleString()})`;
        break;
      case 'individual':
        recipient = `${userSelection.userIds.length} Selected Users`;
        break;
      case 'group':
        recipient = `${userSelection.groupIds.length} Groups (${userSelection.estimatedCount.toLocaleString()} users)`;
        break;
      case 'criteria':
        recipient = `Smart Filter (${userSelection.estimatedCount.toLocaleString()} users)`;
        break;
    }

    const notification: Notification = {
      id: `notif-${Date.now()}`,
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      date: newNotification.scheduleType === 'now' 
        ? new Date().toISOString().split('T')[0]
        : newNotification.scheduleDate,
      status: newNotification.scheduleType === 'now' ? 'sent' : 'scheduled',
      recipient: recipient
    };
    
    setNotifications(prev => [notification, ...prev]);

    // Reset form
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      scheduleType: 'now',
      scheduleDate: ''
    });
    setUserSelection({
      type: 'all',
      userIds: [],
      groupIds: [],
      criteria: {},
      estimatedCount: 0
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      sent: 'default' as const,
      scheduled: 'secondary' as const,
      pending: 'outline' as const
    };
    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return (
      <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {type}
      </Badge>
    );
  };

  const handleSendOfferNotification = () => {
    if (!newOfferNotification.title || !newOfferNotification.description) return;

    let targetAudience = '';
    switch (offerUserSelection.type) {
      case 'all':
        targetAudience = `All Users (${offerUserSelection.estimatedCount.toLocaleString()})`;
        break;
      case 'individual':
        targetAudience = `${offerUserSelection.userIds.length} Selected Users`;
        break;
      case 'group':
        targetAudience = `${offerUserSelection.groupIds.length} Groups (${offerUserSelection.estimatedCount.toLocaleString()} users)`;
        break;
      case 'criteria':
        targetAudience = `Smart Filter (${offerUserSelection.estimatedCount.toLocaleString()} users)`;
        break;
    }

    const offerNotification: OfferNotification = {
      id: `offer-${Date.now()}`,
      title: newOfferNotification.title,
      description: newOfferNotification.description,
      type: newOfferNotification.type,
      reward: {
        type: newOfferNotification.rewardType,
        amount: newOfferNotification.rewardAmount
      },
      expiryDate: newOfferNotification.expiryDate,
      status: 'active',
      targetAudience: targetAudience,
      colorScheme: newOfferNotification.colorScheme,
      urgency: newOfferNotification.urgency,
      displayDuration: newOfferNotification.displayDuration,
      autoReminder: newOfferNotification.autoReminder,
      reminderInterval: newOfferNotification.reminderInterval,
      questions: newOfferNotification.type === 'survey' ? newOfferNotification.questions : undefined,
      taskRequirements: newOfferNotification.type === 'task' ? newOfferNotification.taskRequirements : undefined,
      responses: 0,
      completions: 0,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setOfferNotifications(prev => [offerNotification, ...prev]);

    // Reset form
    setNewOfferNotification({
      title: '',
      description: '',
      type: 'survey',
      rewardType: 'coins',
      rewardAmount: 50,
      expiryDate: '',
      targetAudience: 'all',
      colorScheme: 'blue-purple',
      urgency: 'normal',
      displayDuration: '24h',
      autoReminder: false,
      reminderInterval: '24h',
      questions: [{ id: '1', type: 'text', question: '', options: [], required: true }],
      taskRequirements: [{ id: '1', title: '', description: '', type: 'action', required: true }]
    });
    setOfferUserSelection({
      type: 'all',
      userIds: [],
      groupIds: [],
      criteria: {},
      estimatedCount: 0
    });
  };

  const addQuestion = () => {
    const newQuestion: SurveyQuestion = {
      id: (newOfferNotification.questions.length + 1).toString(),
      type: 'text',
      question: '',
      options: [],
      required: true
    };
    setNewOfferNotification({
      ...newOfferNotification,
      questions: [...newOfferNotification.questions, newQuestion]
    });
  };

  const removeQuestion = (questionId: string) => {
    setNewOfferNotification({
      ...newOfferNotification,
      questions: newOfferNotification.questions.filter(q => q.id !== questionId)
    });
  };

  const updateQuestion = (questionId: string, updates: Partial<SurveyQuestion>) => {
    setNewOfferNotification({
      ...newOfferNotification,
      questions: newOfferNotification.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    });
  };

  const addTaskRequirement = () => {
    const newTask: TaskRequirement = {
      id: (newOfferNotification.taskRequirements.length + 1).toString(),
      title: '',
      description: '',
      type: 'action',
      required: true
    };
    setNewOfferNotification({
      ...newOfferNotification,
      taskRequirements: [...newOfferNotification.taskRequirements, newTask]
    });
  };

  const removeTaskRequirement = (taskId: string) => {
    setNewOfferNotification({
      ...newOfferNotification,
      taskRequirements: newOfferNotification.taskRequirements.filter(t => t.id !== taskId)
    });
  };

  const updateTaskRequirement = (taskId: string, updates: Partial<TaskRequirement>) => {
    setNewOfferNotification({
      ...newOfferNotification,
      taskRequirements: newOfferNotification.taskRequirements.map(t => 
        t.id === taskId ? { ...t, ...updates } : t
      )
    });
  };

  const getRewardBadge = (reward: { type: string; amount: number }) => {
    const colors = {
      coins: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      points: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      rupees: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    return (
      <Badge className={colors[reward.type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {reward.type === 'rupees' ? `₹${reward.amount}` : `${reward.amount} ${reward.type}`}
      </Badge>
    );
  };

  const getOfferStatusBadge = (status: string) => {
    const variants = {
      active: 'default' as const,
      draft: 'secondary' as const,
      expired: 'outline' as const
    };
    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>;
  };

  // Color scheme configurations
  const colorSchemes = {
    'blue-purple': {
      name: 'Ocean Breeze',
      gradient: 'from-blue-500 to-purple-600',
      preview: 'bg-gradient-to-r from-blue-500 to-purple-600',
      icon: '🌊'
    },
    'green-teal': {
      name: 'Forest Fresh',
      gradient: 'from-green-500 to-teal-600',
      preview: 'bg-gradient-to-r from-green-500 to-teal-600',
      icon: '🌿'
    },
    'orange-red': {
      name: 'Sunset Glow',
      gradient: 'from-orange-500 to-red-600',
      preview: 'bg-gradient-to-r from-orange-500 to-red-600',
      icon: '🌅'
    },
    'purple-pink': {
      name: 'Berry Blast',
      gradient: 'from-purple-500 to-pink-600',
      preview: 'bg-gradient-to-r from-purple-500 to-pink-600',
      icon: '🍇'
    },
    'dark-gold': {
      name: 'Midnight Gold',
      gradient: 'from-gray-800 to-yellow-600',
      preview: 'bg-gradient-to-r from-gray-800 to-yellow-600',
      icon: '✨'
    },
    'rainbow': {
      name: 'Rainbow Magic',
      gradient: 'from-pink-500 via-purple-500 to-indigo-600',
      preview: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600',
      icon: '🌈'
    }
  };

  // Urgency level configurations
  const urgencyLevels = {
    'low': {
      name: 'Low Priority',
      icon: <Clock className="w-4 h-4" />,
      color: 'text-gray-600',
      badge: 'secondary'
    },
    'normal': {
      name: 'Normal',
      icon: <Bell className="w-4 h-4" />,
      color: 'text-blue-600',
      badge: 'default'
    },
    'high': {
      name: 'High Priority',
      icon: <AlertTriangle className="w-4 h-4" />,
      color: 'text-orange-600',
      badge: 'destructive'
    },
    'urgent': {
      name: 'Urgent',
      icon: <Zap className="w-4 h-4" />,
      color: 'text-red-600',
      badge: 'destructive'
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    const config = urgencyLevels[urgency as keyof typeof urgencyLevels] || urgencyLevels.normal;
    return (
      <Badge variant={config.badge as any} className="flex items-center gap-1">
        {config.icon}
        {config.name}
      </Badge>
    );
  };

  // Preview Components
  const GeneralNotificationPreview = ({ notification }: { notification: typeof newNotification }) => {
    if (!notification.title && !notification.message) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Fill out the form to see preview</p>
        </div>
      );
    }

    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
        case 'warning': return <Bell className="w-5 h-5 text-yellow-600" />;
        case 'error': return <Bell className="w-5 h-5 text-red-600" />;
        default: return <Bell className="w-5 h-5 text-blue-600" />;
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Eye className="w-4 h-4" />
          Mobile App Preview
        </div>
        
        {/* Realistic Mobile mockup */}
        <div className="max-w-sm mx-auto relative">
          {/* Phone Frame */}
          <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
            {/* Screen */}
            <div className="bg-black rounded-[2.25rem] p-1">
              <div className="bg-white rounded-[2rem] overflow-hidden min-h-[500px] relative">
                {/* Notch/Dynamic Island */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10"></div>
                
                {/* Screen Content */}
                <div className="p-4 pt-10 space-y-4">
                  {/* Status bar */}
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      {/* Signal bars */}
                      <div className="flex items-end gap-0.5">
                        <div className="w-1 h-2 bg-black rounded-full"></div>
                        <div className="w-1 h-3 bg-black rounded-full"></div>
                        <div className="w-1 h-4 bg-black rounded-full"></div>
                        <div className="w-1 h-4 bg-black rounded-full"></div>
                      </div>
                      {/* WiFi */}
                      <div className="w-4 h-3 relative">
                        <div className="absolute inset-0">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-3">
                            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                          </svg>
                        </div>
                      </div>
                      {/* Battery */}
                      <div className="w-6 h-3 border border-black rounded-sm relative">
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0.5 h-1.5 bg-black rounded-r-sm translate-x-full"></div>
                        <div className="w-4/5 h-full bg-black rounded-sm"></div>
                      </div>
                    </div>
                  </div>
            
            {/* Notification */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">WallPe</h4>
                    <span className="text-xs text-muted-foreground">now</span>
                  </div>
                  {notification.title && (
                    <h3 className="font-medium text-sm">{notification.title}</h3>
                  )}
                  {notification.message && (
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Bottom space for phone UI */}
            <div className="flex-1"></div>
            
            {/* Home Indicator */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black rounded-full opacity-60"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OfferNotificationPreview = ({ offer }: { offer: typeof newOfferNotification }) => {
    if (!offer.title && !offer.description) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Fill out the form to see preview</p>
        </div>
      );
    }

    const getRewardIcon = (type: string) => {
      switch (type) {
        case 'coins': return '🪙';
        case 'points': return '⭐';
        case 'rupees': return '₹';
        default: return '🎁';
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Eye className="w-4 h-4" />
          Wallet Page Preview
        </div>
        
        {/* Realistic Mobile mockup */}
        <div className="max-w-sm mx-auto relative">
          {/* Phone Frame */}
          <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
            {/* Screen */}
            <div className="bg-black rounded-[2.25rem] p-1">
              <div className="bg-white rounded-[2rem] overflow-hidden min-h-[600px] relative">
                {/* Notch/Dynamic Island */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10"></div>
                
                {/* Screen Content */}
                <div className="p-4 pt-10 space-y-4">
                  {/* Status bar */}
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      {/* Signal bars */}
                      <div className="flex items-end gap-0.5">
                        <div className="w-1 h-2 bg-black rounded-full"></div>
                        <div className="w-1 h-3 bg-black rounded-full"></div>
                        <div className="w-1 h-4 bg-black rounded-full"></div>
                        <div className="w-1 h-4 bg-black rounded-full"></div>
                      </div>
                      {/* WiFi */}
                      <div className="w-4 h-3 relative">
                        <div className="absolute inset-0">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-3">
                            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                          </svg>
                        </div>
                      </div>
                      {/* Battery */}
                      <div className="w-6 h-3 border border-black rounded-sm relative">
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0.5 h-1.5 bg-black rounded-r-sm translate-x-full"></div>
                        <div className="w-4/5 h-full bg-black rounded-sm"></div>
                      </div>
                    </div>
                  </div>
            
            {/* Header */}
            <div className="text-center py-2">
              <h2 className="font-semibold">Wallet</h2>
            </div>
            
            {/* Offer Card */}
            <div className={`bg-gradient-to-r ${colorSchemes[offer.colorScheme].gradient} text-white rounded-xl p-4 space-y-3 ${offer.urgency === 'urgent' ? 'animate-pulse' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {offer.type === 'survey' ? (
                    <Star className="w-5 h-5" />
                  ) : (
                    <Target className="w-5 h-5" />
                  )}
                  <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
                    {offer.type === 'survey' ? 'Survey' : 'Task'}
                  </span>
                  {(offer.urgency === 'high' || offer.urgency === 'urgent') && (
                    <span className="text-xs font-bold bg-red-500 px-2 py-1 rounded-full flex items-center gap-1">
                      {urgencyLevels[offer.urgency].icon}
                      {offer.urgency.toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    {offer.rewardType === 'rupees' ? `₹${offer.rewardAmount}` : `${getRewardIcon(offer.rewardType)} ${offer.rewardAmount}`}
                  </div>
                  <div className="text-xs opacity-90">{offer.rewardType === 'rupees' ? 'Rupees' : offer.rewardType}</div>
                </div>
              </div>
              
              {offer.title && (
                <h3 className="font-semibold">{offer.title}</h3>
              )}
              
              {offer.description && (
                <p className="text-sm opacity-90">{offer.description}</p>
              )}
              
              <div className="flex items-center justify-between text-xs opacity-75">
                {offer.expiryDate && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Expires: {new Date(offer.expiryDate).toLocaleDateString()}
                  </div>
                )}
                {offer.displayDuration && (
                  <div className="flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    Shows for: {offer.displayDuration === 'until-completed' ? 'Until done' : offer.displayDuration}
                  </div>
                )}
              </div>
              
              <div className="pt-2">
                <Button size="sm" className="w-full bg-white text-blue-600 hover:bg-gray-100">
                  {offer.type === 'survey' ? 'Take Survey' : 'Start Task'}
                </Button>
              </div>
            </div>
            
            {/* Preview content */}
            {offer.type === 'survey' && offer.questions.length > 0 && offer.questions[0].question && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <h4 className="font-medium text-sm">Preview Questions:</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {offer.questions.slice(0, 3).map((question, index) => (
                    question.question && (
                      <div key={question.id} className="text-xs">
                        <span className="font-medium">Q{index + 1}:</span> {question.question}
                      </div>
                    )
                  ))}
                  {offer.questions.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{offer.questions.length - 3} more questions
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {offer.type === 'task' && offer.taskRequirements.length > 0 && offer.taskRequirements[0].title && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <h4 className="font-medium text-sm">Preview Tasks:</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {offer.taskRequirements.slice(0, 3).map((task, index) => (
                    task.title && (
                      <div key={task.id} className="text-xs">
                        <span className="font-medium">{index + 1}.</span> {task.title}
                      </div>
                    )
                  ))}
                  {offer.taskRequirements.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{offer.taskRequirements.length - 3} more tasks
                    </div>
                  )}
                </div>
              </div>
            )}

                  {/* Bottom Navigation Area */}
                  <div className="absolute bottom-6 left-4 right-4">
                    <div className="flex justify-center space-x-8 py-3 bg-gray-50 rounded-2xl">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        <div className="w-8 h-1 bg-gray-300 rounded mt-1"></div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                        <div className="w-8 h-1 bg-blue-500 rounded mt-1"></div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        <div className="w-8 h-1 bg-gray-300 rounded mt-1"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Home Indicator */}
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black rounded-full opacity-60"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview content outside phone */}
          <div className="mt-6 space-y-4">
            {offer.type === 'survey' && offer.questions.length > 0 && offer.questions[0].question && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <h4 className="font-medium text-sm">Preview Questions:</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {offer.questions.slice(0, 3).map((question, index) => (
                    question.question && (
                      <div key={question.id} className="text-xs">
                        <span className="font-medium">Q{index + 1}:</span> {question.question}
                      </div>
                    )
                  ))}
                  {offer.questions.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{offer.questions.length - 3} more questions
                    </div>
                  )}
                </div>
              </div>
            )}

            {offer.type === 'task' && offer.taskRequirements.length > 0 && offer.taskRequirements[0].title && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <h4 className="font-medium text-sm">Preview Tasks:</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {offer.taskRequirements.slice(0, 3).map((task, index) => (
                    task.title && (
                      <div key={task.id} className="text-xs">
                        <span className="font-medium">{index + 1}.</span> {task.title}
                      </div>
                    )
                  ))}
                  {offer.taskRequirements.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{offer.taskRequirements.length - 3} more tasks
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reminder Settings Info */}
            {offer.autoReminder && (
              <div className="bg-blue-50 rounded-lg p-3 space-y-1">
                <h4 className="font-medium text-sm flex items-center gap-1">
                  <Bell className="w-3 h-3" />
                  Auto Reminders Enabled
                </h4>
                <p className="text-xs text-muted-foreground">
                  Users will be reminded every {offer.reminderInterval === '1h' ? '1 hour' : 
                  offer.reminderInterval === '6h' ? '6 hours' : 
                  offer.reminderInterval === '12h' ? '12 hours' : 
                  offer.reminderInterval === '24h' ? '24 hours' : '48 hours'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            General Notifications
          </TabsTrigger>
          <TabsTrigger value="offers" className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Offer Notifications
          </TabsTrigger>
        </TabsList>

        {/* General Notifications Tab */}
        <TabsContent value="general" className="space-y-6">
          {/* Create General Notification Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Send General Notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Notification title..."
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={newNotification.type} 
                    onValueChange={(value: any) => setNewNotification({...newNotification, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your notification message..."
                  rows={3}
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <Label>Recipients</Label>
                <AdvancedUserSelector
                  onSelectionChange={setUserSelection}
                  initialSelection={userSelection}
                />
                
                {userSelection.estimatedCount > 0 && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="font-medium">
                        {userSelection.estimatedCount.toLocaleString()} users selected
                      </span>
                      <Badge variant="outline">
                        {userSelection.type === 'all' ? 'All Users' :
                         userSelection.type === 'individual' ? 'Individual Selection' :
                         userSelection.type === 'group' ? 'Group Selection' :
                         'Smart Filter'}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label>Schedule</Label>
                <RadioGroup 
                  value={newNotification.scheduleType} 
                  onValueChange={(value: any) => setNewNotification({...newNotification, scheduleType: value})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="now" id="now" />
                    <Label htmlFor="now" className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Now
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="later" id="later" />
                    <Label htmlFor="later" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Schedule for Later
                    </Label>
                  </div>
                </RadioGroup>

                {newNotification.scheduleType === 'later' && (
                  <Input
                    type="datetime-local"
                    value={newNotification.scheduleDate}
                    onChange={(e) => setNewNotification({...newNotification, scheduleDate: e.target.value})}
                  />
                )}
              </div>

              <Button 
                onClick={handleSendNotification}
                disabled={!newNotification.title || !newNotification.message}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                {newNotification.scheduleType === 'now' ? 'Send Now' : 'Schedule Notification'}
              </Button>
            </CardContent>
          </Card>
          
          {/* General Notification Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Notification Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GeneralNotificationPreview notification={newNotification} />
            </CardContent>
          </Card>
        </div>

          {/* General Notifications History */}
          <Card>
            <CardHeader>
              <CardTitle>General Notification History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notifications Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell className="font-medium">{notification.title}</TableCell>
                        <TableCell>{getTypeBadge(notification.type)}</TableCell>
                        <TableCell>{notification.recipient}</TableCell>
                        <TableCell>{new Date(notification.date).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(notification.status)}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="ghost">
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{notification.title}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm text-muted-foreground">Type</Label>
                                  <p>{getTypeBadge(notification.type)}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-muted-foreground">Message</Label>
                                  <p className="mt-1">{notification.message}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-muted-foreground">Recipient</Label>
                                  <p>{notification.recipient}</p>
                                </div>
                                <div className="flex justify-between">
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Date</Label>
                                    <p>{new Date(notification.date).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Status</Label>
                                    <p>{getStatusBadge(notification.status)}</p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredNotifications.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No notifications found matching your criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Offer Notifications Tab */}
        <TabsContent value="offers" className="space-y-6">
          {/* Create Offer Notification Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Create Offer Notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="offer-title">Title</Label>
                  <Input
                    id="offer-title"
                    placeholder="Offer notification title..."
                    value={newOfferNotification.title}
                    onChange={(e) => setNewOfferNotification({...newOfferNotification, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="offer-type">Type</Label>
                  <Select 
                    value={newOfferNotification.type} 
                    onValueChange={(value: any) => setNewOfferNotification({...newOfferNotification, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="survey">Survey</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="offer-description">Description</Label>
                <Textarea
                  id="offer-description"
                  placeholder="Enter offer description..."
                  rows={3}
                  value={newOfferNotification.description}
                  onChange={(e) => setNewOfferNotification({...newOfferNotification, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reward-type">Reward Type</Label>
                  <Select 
                    value={newOfferNotification.rewardType} 
                    onValueChange={(value: any) => setNewOfferNotification({...newOfferNotification, rewardType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coins">Coins</SelectItem>
                      <SelectItem value="points">Points</SelectItem>
                      <SelectItem value="rupees">Rupees (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reward-amount">Reward Amount</Label>
                  <Input
                    id="reward-amount"
                    type="number"
                    placeholder="50"
                    value={newOfferNotification.rewardAmount}
                    onChange={(e) => setNewOfferNotification({...newOfferNotification, rewardAmount: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry-date">Expiry Date</Label>
                  <Input
                    id="expiry-date"
                    type="date"
                    value={newOfferNotification.expiryDate}
                    onChange={(e) => setNewOfferNotification({...newOfferNotification, expiryDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Target Audience</Label>
                <AdvancedUserSelector
                  onSelectionChange={setOfferUserSelection}
                  initialSelection={offerUserSelection}
                />
                
                {offerUserSelection.estimatedCount > 0 && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="font-medium">
                        {offerUserSelection.estimatedCount.toLocaleString()} users selected
                      </span>
                      <Badge variant="outline">
                        {offerUserSelection.type === 'all' ? 'All Users' :
                         offerUserSelection.type === 'individual' ? 'Individual Selection' :
                         offerUserSelection.type === 'group' ? 'Group Selection' :
                         'Smart Filter'}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* Design Options */}
              <div className="space-y-4">
                <Separator />
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <Label className="text-base font-medium">Design & Display Options</Label>
                </div>
                
                <div className="space-y-3">
                  <Label>Color Scheme</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(colorSchemes).map(([key, scheme]) => (
                      <div
                        key={key}
                        className={`relative cursor-pointer rounded-lg p-3 border-2 transition-all ${
                          newOfferNotification.colorScheme === key 
                            ? 'border-primary ring-2 ring-primary/20' 
                            : 'border-border hover:border-muted-foreground'
                        }`}
                        onClick={() => setNewOfferNotification({...newOfferNotification, colorScheme: key as any})}
                      >
                        <div className={`w-full h-8 rounded ${scheme.preview} mb-2`}></div>
                        <div className="text-xs font-medium flex items-center gap-1">
                          <span>{scheme.icon}</span>
                          {scheme.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Urgency Level</Label>
                    <Select 
                      value={newOfferNotification.urgency} 
                      onValueChange={(value: any) => setNewOfferNotification({...newOfferNotification, urgency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(urgencyLevels).map(([key, level]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              {level.icon}
                              {level.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Display Duration</Label>
                    <Select 
                      value={newOfferNotification.displayDuration} 
                      onValueChange={(value: any) => setNewOfferNotification({...newOfferNotification, displayDuration: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 Hour</SelectItem>
                        <SelectItem value="6h">6 Hours</SelectItem>
                        <SelectItem value="12h">12 Hours</SelectItem>
                        <SelectItem value="24h">24 Hours</SelectItem>
                        <SelectItem value="48h">48 Hours</SelectItem>
                        <SelectItem value="7d">7 Days</SelectItem>
                        <SelectItem value="until-completed">Until Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="auto-reminder"
                      checked={newOfferNotification.autoReminder}
                      onCheckedChange={(checked) => setNewOfferNotification({...newOfferNotification, autoReminder: checked as boolean})}
                    />
                    <Label htmlFor="auto-reminder" className="flex items-center gap-2">
                      <Timer className="w-4 h-4" />
                      Enable Auto Reminders
                    </Label>
                  </div>

                  {newOfferNotification.autoReminder && (
                    <div className="space-y-2 ml-6">
                      <Label>Reminder Interval</Label>
                      <Select 
                        value={newOfferNotification.reminderInterval} 
                        onValueChange={(value: any) => setNewOfferNotification({...newOfferNotification, reminderInterval: value})}
                      >
                        <SelectTrigger className="w-full md:w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">Every 1 Hour</SelectItem>
                          <SelectItem value="6h">Every 6 Hours</SelectItem>
                          <SelectItem value="12h">Every 12 Hours</SelectItem>
                          <SelectItem value="24h">Every 24 Hours</SelectItem>
                          <SelectItem value="48h">Every 48 Hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {newOfferNotification.type === 'survey' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Survey Questions</Label>
                    <Button size="sm" variant="outline" onClick={addQuestion}>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                  
                  {newOfferNotification.questions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Question {index + 1}</Label>
                        {newOfferNotification.questions.length > 1 && (
                          <Button size="sm" variant="ghost" onClick={() => removeQuestion(question.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Question Type</Label>
                          <Select 
                            value={question.type} 
                            onValueChange={(value: any) => updateQuestion(question.id, { type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                              <SelectItem value="rating">Rating</SelectItem>
                              <SelectItem value="yes-no">Yes/No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Required</Label>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={question.required}
                              onCheckedChange={(checked) => updateQuestion(question.id, { required: !!checked })}
                            />
                            <Label>Required Question</Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Question Text</Label>
                        <Input
                          placeholder="Enter your question..."
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                        />
                      </div>
                      
                      {question.type === 'multiple-choice' && (
                        <div className="space-y-2">
                          <Label>Options (one per line)</Label>
                          <Textarea
                            placeholder="Option 1&#10;Option 2&#10;Option 3"
                            value={question.options?.join('\n') || ''}
                            onChange={(e) => updateQuestion(question.id, { options: e.target.value.split('\n').filter(o => o.trim()) })}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {newOfferNotification.type === 'task' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Task Requirements</Label>
                    <Button size="sm" variant="outline" onClick={addTaskRequirement}>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                  
                  {newOfferNotification.taskRequirements.map((task, index) => (
                    <div key={task.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Task {index + 1}</Label>
                        {newOfferNotification.taskRequirements.length > 1 && (
                          <Button size="sm" variant="ghost" onClick={() => removeTaskRequirement(task.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Task Type</Label>
                          <Select 
                            value={task.type} 
                            onValueChange={(value: any) => updateTaskRequirement(task.id, { type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="action">Action</SelectItem>
                              <SelectItem value="verification">Verification</SelectItem>
                              <SelectItem value="sharing">Sharing</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Required</Label>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={task.required}
                              onCheckedChange={(checked) => updateTaskRequirement(task.id, { required: !!checked })}
                            />
                            <Label>Required Task</Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Task Title</Label>
                        <Input
                          placeholder="Enter task title..."
                          value={task.title}
                          onChange={(e) => updateTaskRequirement(task.id, { title: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Task Description</Label>
                        <Textarea
                          placeholder="Enter task description..."
                          value={task.description}
                          onChange={(e) => updateTaskRequirement(task.id, { description: e.target.value })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button 
                onClick={handleSendOfferNotification}
                disabled={!newOfferNotification.title || !newOfferNotification.description}
                className="w-full"
              >
                <Gift className="w-4 h-4 mr-2" />
                Create Offer Notification
              </Button>
            </CardContent>
          </Card>
          
          {/* Offer Notification Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Offer Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OfferNotificationPreview offer={newOfferNotification} />
            </CardContent>
          </Card>
        </div>

          {/* Offer Notifications Management */}
          <Card>
            <CardHeader>
              <CardTitle>Offer Notifications Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {offerNotifications.map((offer) => (
                  <div key={offer.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium">{offer.title}</h4>
                          {offer.type === 'survey' ? (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Survey
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              Task
                            </Badge>
                          )}
                          <div className="flex items-center gap-1">
                            <div className={`w-3 h-3 rounded-full ${colorSchemes[offer.colorScheme].preview}`} title={colorSchemes[offer.colorScheme].name}></div>
                            <span className="text-xs text-muted-foreground">{colorSchemes[offer.colorScheme].icon}</span>
                          </div>
                          {(offer.urgency === 'high' || offer.urgency === 'urgent') && (
                            <Badge variant="destructive" className="flex items-center gap-1 text-xs">
                              {urgencyLevels[offer.urgency].icon}
                              {offer.urgency}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{offer.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getRewardBadge(offer.reward)}
                        {getOfferStatusBadge(offer.status)}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Target</Label>
                        <p>{offer.targetAudience}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Responses</Label>
                        <p>{offer.responses || 0}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Completions</Label>
                        <p>{offer.completions || 0}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Expires</Label>
                        <p>{new Date(offer.expiryDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Theme</Label>
                        <div className="flex items-center gap-1">
                          <div className={`w-3 h-3 rounded ${colorSchemes[offer.colorScheme].preview}`}></div>
                          <span className="text-xs">{colorSchemes[offer.colorScheme].name}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Display</Label>
                        <p className="flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          {offer.displayDuration === 'until-completed' ? 'Until done' : offer.displayDuration}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{offer.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm text-muted-foreground">Description</Label>
                              <p>{offer.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm text-muted-foreground">Type</Label>
                                <p>{offer.type}</p>
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground">Reward</Label>
                                <p>{offer.reward.amount} {offer.reward.type}</p>
                              </div>
                            </div>
                            
                            {offer.questions && (
                              <div>
                                <Label className="text-sm text-muted-foreground">Survey Questions</Label>
                                <div className="space-y-2 mt-2">
                                  {offer.questions.map((question, index) => (
                                    <div key={question.id} className="border rounded p-3">
                                      <p className="font-medium">Q{index + 1}: {question.question}</p>
                                      <p className="text-sm text-muted-foreground">Type: {question.type}</p>
                                      {question.options && (
                                        <div className="mt-1">
                                          <p className="text-sm text-muted-foreground">Options:</p>
                                          <ul className="text-sm list-disc list-inside ml-2">
                                            {question.options.map((option, idx) => (
                                              <li key={idx}>{option}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {offer.taskRequirements && (
                              <div>
                                <Label className="text-sm text-muted-foreground">Task Requirements</Label>
                                <div className="space-y-2 mt-2">
                                  {offer.taskRequirements.map((task, index) => (
                                    <div key={task.id} className="border rounded p-3">
                                      <p className="font-medium">{index + 1}. {task.title}</p>
                                      <p className="text-sm">{task.description}</p>
                                      <p className="text-sm text-muted-foreground">Type: {task.type}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="ghost">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}