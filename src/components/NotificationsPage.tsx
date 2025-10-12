import React, { useState } from 'react';
import { Send, Bell, Calendar, User, Users, Filter, Search, Gift, CheckCircle, PlusCircle, Trash2, Star, Target, Eye, Smartphone, Clock, Palette, Timer, AlertTriangle, Zap, Image, Link, ExternalLink, FileImage, Film, Upload, File, X } from 'lucide-react';
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

type NotificationMediaType = 'none' | 'image' | 'gif' | 'file' | 'video';

type EnhancedNotification = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  deliveryType: 'in-app' | 'push' | 'both';
  mediaType: NotificationMediaType;
  mediaUrl?: string;
  mediaAltText?: string;
  deepLink?: string;
  externalUrl?: string;
  scheduleType: 'now' | 'later';
  scheduleDate?: string;
  date: string;
  status: 'sent' | 'scheduled' | 'pending';
  recipient: string;
};

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
  const [notifications, setNotifications] = useState<EnhancedNotification[]>([
    {
      id: 'notif-1',
      title: 'Welcome to WallPe!',
      message: 'Start exploring amazing advertising opportunities in your area.',
      type: 'success',
      deliveryType: 'both',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
      mediaAltText: 'Welcome image',
      deepLink: 'wallpe://dashboard',
      scheduleType: 'now',
      date: '2024-09-25',
      status: 'sent',
      recipient: 'All Users (45,232)'
    },
    {
      id: 'notif-2',
      title: 'Profile Verification Required',
      message: 'Complete your profile verification to unlock premium features.',
      type: 'warning',
      deliveryType: 'push',
      mediaType: 'none',
      externalUrl: 'https://wallpe.com/verify',
      scheduleType: 'now',
      date: '2024-09-24',
      status: 'sent',
      recipient: 'Unverified Users (2,847)'
    }
  ]);

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
  
  // Enhanced notification form state
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    deliveryType: 'both' as 'in-app' | 'push' | 'both',
    mediaType: 'none' as NotificationMediaType,
    mediaUrl: '',
    mediaAltText: '',
    deepLink: '',
    externalUrl: '',
    scheduleType: 'now' as 'now' | 'later',
    scheduleDate: ''
  });

  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // User selection state for general notifications
  const [userSelection, setUserSelection] = useState({
    type: 'all' as 'individual' | 'group' | 'criteria' | 'all',
    userIds: [] as string[],
    groupIds: [] as string[],
    criteria: {},
    estimatedCount: 45232
  });

  // User selection state for offer notifications
  const [offerUserSelection, setOfferUserSelection] = useState({
    type: 'all' as 'individual' | 'group' | 'criteria' | 'all',
    userIds: [] as string[],
    groupIds: [] as string[],
    criteria: {},
    estimatedCount: 45232
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

    const notification: EnhancedNotification = {
      id: `notif-${Date.now()}`,
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      deliveryType: newNotification.deliveryType,
      mediaType: newNotification.mediaType,
      mediaUrl: newNotification.mediaUrl || undefined,
      mediaAltText: newNotification.mediaAltText || undefined,
      deepLink: newNotification.deepLink || undefined,
      externalUrl: newNotification.externalUrl || undefined,
      date: newNotification.scheduleType === 'now' 
        ? new Date().toISOString().split('T')[0]
        : newNotification.scheduleDate,
      status: newNotification.scheduleType === 'now' ? 'sent' : 'scheduled',
      recipient: recipient,
      scheduleType: newNotification.scheduleType
    };
    
    setNotifications(prev => [notification, ...prev]);

    // Reset form
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      deliveryType: 'both',
      mediaType: 'none',
      mediaUrl: '',
      mediaAltText: '',
      deepLink: '',
      externalUrl: '',
      scheduleType: 'now',
      scheduleDate: ''
    });
    setUserSelection({
      type: 'all',
      userIds: [],
      groupIds: [],
      criteria: {},
      estimatedCount: 45232
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

  const getDeliveryTypeBadge = (deliveryType: string) => {
    const colors = {
      'in-app': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'push': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'both': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    };
    return (
      <Badge className={colors[deliveryType as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {deliveryType}
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
      estimatedCount: 45232
    });
  };

  // Media type handlers
  const handleMediaUrlChange = (url: string) => {
    setNewNotification({ ...newNotification, mediaUrl: url });
  };

  // File upload handlers
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setIsUploading(false);
          // Set the media URL to the uploaded file (in real app, this would be the server URL)
          setNewNotification({ 
            ...newNotification, 
            mediaUrl: URL.createObjectURL(file),
            mediaAltText: file.name
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setNewNotification({ 
      ...newNotification, 
      mediaUrl: '', 
      mediaAltText: '' 
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

    const renderDeliveryPreviews = () => {
      const previews: React.ReactNode[] = [];
      
      if (notification.deliveryType === 'in-app' || notification.deliveryType === 'both') {
        previews.push(
          <div key="in-app" className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Smartphone className="w-4 h-4" />
              In-App Notification Preview
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
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
                    <h3 className="font-medium">{notification.title}</h3>
                  )}
                  {notification.message && (
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  )}
                  {notification.mediaType !== 'none' && notification.mediaUrl && (
                    <div className="mt-2">
                      {notification.mediaType === 'image' && (
                        <img 
                          src={notification.mediaUrl} 
                          alt={notification.mediaAltText || 'Notification image'} 
                          className="rounded-lg max-w-full h-32 object-cover"
                        />
                      )}
                      {notification.mediaType === 'gif' && (
                        <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                          <Film className="w-4 h-4" />
                          <span className="text-sm">GIF: {notification.mediaAltText || 'Animation'}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {(notification.deepLink || notification.externalUrl) && (
                    <div className="flex gap-2 mt-2">
                      {notification.deepLink && (
                        <Button size="sm" variant="outline" className="text-xs">
                          <Link className="w-3 h-3 mr-1" />
                          Open in App
                        </Button>
                      )}
                      {notification.externalUrl && (
                        <Button size="sm" variant="outline" className="text-xs">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View More
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }

      if (notification.deliveryType === 'push' || notification.deliveryType === 'both') {
        previews.push(
          <div key="push" className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bell className="w-4 h-4" />
              Push Notification Preview
            </div>
            {/* Realistic Mobile mockup for Push */}
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
                          {/* Battery */}
                          <div className="w-6 h-3 border border-black rounded-sm relative">
                            <div className="w-4/5 h-full bg-black rounded-sm"></div>
                          </div>
                        </div>
                      </div>
                
                      {/* Push Notification */}
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3 border shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">W</span>
                          </div>
                          <div className="flex-1 space-y-1">
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
                            {notification.mediaType !== 'none' && notification.mediaUrl && (
                              <div className="mt-2">
                                {notification.mediaType === 'image' && (
                                  <img 
                                    src={notification.mediaUrl} 
                                    alt={notification.mediaAltText || 'Notification image'} 
                                    className="rounded-md w-full h-20 object-cover"
                                  />
                                )}
                                {notification.mediaType === 'gif' && (
                                  <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
                                    <Film className="w-3 h-3" />
                                    <span className="text-xs">GIF</span>
                                  </div>
                                )}
                              </div>
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
      }

      return previews;
    };

    return (
      <div className="space-y-6">
        {renderDeliveryPreviews()}
        
        {/* Additional Preview Info */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-sm">Additional Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="font-medium">Delivery Type:</span> {notification.deliveryType}
            </div>
            {notification.mediaType !== 'none' && (
              <div>
                <span className="font-medium">Media:</span> {notification.mediaType}
              </div>
            )}
            {notification.deepLink && (
              <div>
                <span className="font-medium">Deep Link:</span> {notification.deepLink}
              </div>
            )}
            {notification.externalUrl && (
              <div>
                <span className="font-medium">External URL:</span> {notification.externalUrl}
              </div>
            )}
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
                      {/* Battery */}
                      <div className="w-6 h-3 border border-black rounded-sm relative">
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

                {/* Delivery Type Selection */}
                <div className="space-y-3">
                  <Label>Delivery Type</Label>
                  <RadioGroup 
                    value={newNotification.deliveryType} 
                    onValueChange={(value: any) => setNewNotification({...newNotification, deliveryType: value})}
                    className="grid grid-cols-3 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="in-app" id="in-app" />
                      <Label htmlFor="in-app" className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        In-App Only
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="push" id="push" />
                      <Label htmlFor="push" className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Push Only
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="both" />
                      <Label htmlFor="both" className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Both
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Media Options */}
                <div className="space-y-3">
                  <Label>Media Options</Label>
                  <Select 
                    value={newNotification.mediaType} 
                    onValueChange={(value: NotificationMediaType) => {
                      setNewNotification({...newNotification, mediaType: value, mediaUrl: '', mediaAltText: ''});
                      setUploadedFile(null);
                      setUploadProgress(0);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Media</SelectItem>
                      <SelectItem value="image">
                        <div className="flex items-center gap-2">
                          <Image className="w-4 h-4" />
                          Image URL
                        </div>
                      </SelectItem>
                      <SelectItem value="gif">
                        <div className="flex items-center gap-2">
                          <Film className="w-4 h-4" />
                          GIF URL
                        </div>
                      </SelectItem>
                      <SelectItem value="file">
                        <div className="flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Upload File
                        </div>
                      </SelectItem>
                      <SelectItem value="video">
                        <div className="flex items-center gap-2">
                          <Film className="w-4 h-4" />
                          Upload Video
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {newNotification.mediaType !== 'none' && (
                    <div className="space-y-2">
                      {(newNotification.mediaType === 'image' || newNotification.mediaType === 'gif') && (
                        <div className="grid grid-cols-1 gap-2">
                          <Input
                            placeholder={`${newNotification.mediaType === 'image' ? 'Image' : 'GIF'} URL...`}
                            value={newNotification.mediaUrl}
                            onChange={(e) => setNewNotification({...newNotification, mediaUrl: e.target.value})}
                          />
                          <Input
                            placeholder="Alt text / Description..."
                            value={newNotification.mediaAltText}
                            onChange={(e) => setNewNotification({...newNotification, mediaAltText: e.target.value})}
                          />
                        </div>
                      )}

                      {(newNotification.mediaType === 'file' || newNotification.mediaType === 'video') && (
                        <div className="space-y-3">
                          {/* File Upload Area */}
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                            <input
                              type="file"
                              id="file-upload"
                              className="hidden"
                              accept={newNotification.mediaType === 'video' ? 'video/*' : '*/*'}
                              onChange={handleFileUpload}
                              disabled={isUploading}
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                              {isUploading ? (
                                <div className="space-y-2">
                                  <Upload className="w-8 h-8 mx-auto text-primary animate-pulse" />
                                  <div className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</div>
                                  <div className="w-full bg-muted rounded-full h-2">
                                    <div 
                                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                                      style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ) : uploadedFile ? (
                                <div className="space-y-2">
                                  <File className="w-8 h-8 mx-auto text-green-600" />
                                  <div className="text-sm font-medium">{uploadedFile.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={removeUploadedFile}
                                    className="mt-2"
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                                  <div className="text-sm font-medium">
                                    Click to upload {newNotification.mediaType === 'video' ? 'video' : 'file'}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Max size: 10MB
                                  </div>
                                </div>
                              )}
                            </label>
                          </div>

                          {/* File Description */}
                          {newNotification.mediaType === 'file' && (
                            <Input
                              placeholder="File description (optional)..."
                              value={newNotification.mediaAltText}
                              onChange={(e) => setNewNotification({...newNotification, mediaAltText: e.target.value})}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Links */}
                <div className="space-y-3">
                  <Label>Action Links (Optional)</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="deepLink" className="text-sm flex items-center gap-1">
                        <Link className="w-3 h-3" />
                        Deep Link (opens in app)
                      </Label>
                      <Input
                        id="deepLink"
                        placeholder="wallpe://profile, wallpe://wallet..."
                        value={newNotification.deepLink}
                        onChange={(e) => setNewNotification({...newNotification, deepLink: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="externalUrl" className="text-sm flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        External URL (opens in browser)
                      </Label>
                      <Input
                        id="externalUrl"
                        placeholder="https://example.com..."
                        value={newNotification.externalUrl}
                        onChange={(e) => setNewNotification({...newNotification, externalUrl: e.target.value})}
                      />
                    </div>
                  </div>
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
                      <TableHead>Delivery</TableHead>
                      <TableHead>Media</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{notification.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {notification.message.substring(0, 50)}...
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(notification.type)}</TableCell>
                        <TableCell>{getDeliveryTypeBadge(notification.deliveryType)}</TableCell>
                        <TableCell>
                          {notification.mediaType !== 'none' && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              {notification.mediaType === 'image' ? <Image className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                              {notification.mediaType}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{notification.recipient}</TableCell>
                        <TableCell>{notification.date}</TableCell>
                        <TableCell>{getStatusBadge(notification.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
                    <Label htmlFor="offerTitle">Title</Label>
                    <Input
                      id="offerTitle"
                      placeholder="Offer title..."
                      value={newOfferNotification.title}
                      onChange={(e) => setNewOfferNotification({...newOfferNotification, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="offerType">Type</Label>
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
                  <Label htmlFor="offerDescription">Description</Label>
                  <Textarea
                    id="offerDescription"
                    placeholder="Enter offer description..."
                    rows={3}
                    value={newOfferNotification.description}
                    onChange={(e) => setNewOfferNotification({...newOfferNotification, description: e.target.value})}
                  />
                </div>

                {/* Reward Configuration */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Reward Type</Label>
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
                        <SelectItem value="rupees">Rupees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={newOfferNotification.rewardAmount}
                      onChange={(e) => setNewOfferNotification({...newOfferNotification, rewardAmount: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                {/* Visual and Behavior Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Color Scheme</Label>
                    <Select 
                      value={newOfferNotification.colorScheme} 
                      onValueChange={(value: any) => setNewOfferNotification({...newOfferNotification, colorScheme: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(colorSchemes).map(([key, scheme]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${scheme.preview}`}></div>
                              <span>{scheme.icon} {scheme.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                              <span>{level.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input
                      type="date"
                      value={newOfferNotification.expiryDate}
                      onChange={(e) => setNewOfferNotification({...newOfferNotification, expiryDate: e.target.value})}
                    />
                  </div>
                </div>

                {/* Auto Reminder Settings */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="autoReminder"
                      checked={newOfferNotification.autoReminder}
                      onCheckedChange={(checked) => setNewOfferNotification({...newOfferNotification, autoReminder: checked as boolean})}
                    />
                    <Label htmlFor="autoReminder">Enable Auto Reminders</Label>
                  </div>
                  
                  {newOfferNotification.autoReminder && (
                    <div className="ml-6 space-y-2">
                      <Label>Reminder Interval</Label>
                      <Select 
                        value={newOfferNotification.reminderInterval} 
                        onValueChange={(value: any) => setNewOfferNotification({...newOfferNotification, reminderInterval: value})}
                      >
                        <SelectTrigger>
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

                {/* Recipients Section */}
                <div className="space-y-3">
                  <Label>Recipients</Label>
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

                {/* Survey Questions or Task Requirements */}
                {newOfferNotification.type === 'survey' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Survey Questions</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Question
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {newOfferNotification.questions.map((question, index) => (
                        <div key={question.id} className="border rounded-lg p-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">Question {index + 1}</span>
                            {newOfferNotification.questions.length > 1 && (
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => removeQuestion(question.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Select 
                              value={question.type} 
                              onValueChange={(value: any) => updateQuestion(question.id, { type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text Response</SelectItem>
                                <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                <SelectItem value="rating">Rating</SelectItem>
                                <SelectItem value="yes-no">Yes/No</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                checked={question.required}
                                onCheckedChange={(checked) => updateQuestion(question.id, { required: checked as boolean })}
                              />
                              <Label className="text-sm">Required</Label>
                            </div>
                          </div>
                          
                          <Input
                            placeholder="Enter question text..."
                            value={question.question}
                            onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                          />
                          
                          {question.type === 'multiple-choice' && (
                            <div className="space-y-2">
                              <Label className="text-sm">Options (one per line)</Label>
                              <Textarea
                                placeholder="Option 1&#10;Option 2&#10;Option 3"
                                rows={3}
                                value={question.options?.join('\n') || ''}
                                onChange={(e) => updateQuestion(question.id, { options: e.target.value.split('\n').filter(opt => opt.trim()) })}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Task Requirements</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addTaskRequirement}>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Task
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {newOfferNotification.taskRequirements.map((task, index) => (
                        <div key={task.id} className="border rounded-lg p-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">Task {index + 1}</span>
                            {newOfferNotification.taskRequirements.length > 1 && (
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => removeTaskRequirement(task.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                            
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                checked={task.required}
                                onCheckedChange={(checked) => updateTaskRequirement(task.id, { required: checked as boolean })}
                              />
                              <Label className="text-sm">Required</Label>
                            </div>
                          </div>
                          
                          <Input
                            placeholder="Task title..."
                            value={task.title}
                            onChange={(e) => updateTaskRequirement(task.id, { title: e.target.value })}
                          />
                          
                          <Textarea
                            placeholder="Task description..."
                            rows={2}
                            value={task.description}
                            onChange={(e) => updateTaskRequirement(task.id, { description: e.target.value })}
                          />
                        </div>
                      ))}
                    </div>
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

          {/* Offer Notifications History */}
          <Card>
            <CardHeader>
              <CardTitle>Offer Notification History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Reward</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Target Audience</TableHead>
                      <TableHead>Responses</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offerNotifications.map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{offer.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {offer.description.substring(0, 40)}...
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {offer.type === 'survey' ? (
                              <><Star className="w-3 h-3 mr-1" />Survey</>
                            ) : (
                              <><Target className="w-3 h-3 mr-1" />Task</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>{getRewardBadge(offer.reward)}</TableCell>
                        <TableCell>{getUrgencyBadge(offer.urgency)}</TableCell>
                        <TableCell className="text-sm">{offer.targetAudience}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{offer.responses || 0} responses</div>
                            <div className="text-muted-foreground">{offer.completions || 0} completed</div>
                          </div>
                        </TableCell>
                        <TableCell>{getOfferStatusBadge(offer.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}