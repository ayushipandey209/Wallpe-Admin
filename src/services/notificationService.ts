import { supabase } from './supabase';
import { ProfileService, type ProfileWithStats } from './profileService';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  date: string;
  status: 'sent' | 'scheduled' | 'pending';
  recipient: string;
  recipientId?: string;
  createdBy?: string;
}

export interface NotificationCreate {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  recipientType: 'individual' | 'group' | 'all';
  selectedUsers: string[];
  scheduleType: 'now' | 'later';
  scheduleDate?: string;
}

export class NotificationService {
  /**
   * Get all notifications
   */
  static async getAllNotifications(): Promise<Notification[]> {
    try {
      // For now, we'll create a mock implementation that uses real user data
      // In a real app, you'd have a notifications table in your database
      const users = await ProfileService.getAllProfiles();
      
      // Create some sample notifications using real user data
      const notifications: Notification[] = [
        {
          id: 'notif-001',
          title: 'Welcome to WallPe',
          message: 'Thank you for joining our platform. Start by creating your first listing!',
          type: 'info',
          date: new Date().toISOString().split('T')[0],
          status: 'sent',
          recipient: users[0]?.name ?? 'New User',
          recipientId: users[0]?.id,
        },
        {
          id: 'notif-002',
          title: 'Listing Approved',
          message: 'Your wall advertisement listing has been approved and is now live.',
          type: 'success',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
          status: 'sent',
          recipient: users[1]?.name ?? 'User',
          recipientId: users[1]?.id,
        },
        {
          id: 'notif-003',
          title: 'Payment Reminder',
          message: 'Your monthly subscription payment is due in 3 days.',
          type: 'warning',
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 days ago
          status: 'scheduled',
          recipient: users[2]?.name ?? 'User',
          recipientId: users[2]?.id,
        },
        {
          id: 'notif-004',
          title: 'Account Status Update',
          message: 'Your account status has been updated. Please check your profile.',
          type: 'info',
          date: new Date(Date.now() - 259200000).toISOString().split('T')[0], // 3 days ago
          status: 'sent',
          recipient: users[3]?.name ?? 'User',
          recipientId: users[3]?.id,
        }
      ];

      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Get all users for notification recipients
   */
  static async getUsersForNotification(): Promise<ProfileWithStats[]> {
    try {
      return await ProfileService.getAllProfiles();
    } catch (error) {
      console.error('Error fetching users for notification:', error);
      throw error;
    }
  }

  /**
   * Create a new notification
   */
  static async createNotification(notificationData: NotificationCreate): Promise<Notification[]> {
    try {
      const users = await ProfileService.getAllProfiles();
      const newNotifications: Notification[] = [];

      // Determine recipients based on type
      let recipients: ProfileWithStats[] = [];
      
      if (notificationData.recipientType === 'all') {
        recipients = users;
      } else if (notificationData.recipientType === 'individual') {
        recipients = users.filter(user => notificationData.selectedUsers.includes(user.id));
      } else if (notificationData.recipientType === 'group') {
        // For group, you might have a different logic
        // For now, we'll use all users as a fallback
        recipients = users;
      }

      // Create notification for each recipient
      recipients.forEach((user, index) => {
        const notification: Notification = {
          id: `notif-${Date.now()}-${index}`,
          title: notificationData.title,
          message: notificationData.message,
          type: notificationData.type,
          date: notificationData.scheduleType === 'now' 
            ? new Date().toISOString().split('T')[0]
            : notificationData.scheduleDate ?? new Date().toISOString().split('T')[0],
          status: notificationData.scheduleType === 'now' ? 'sent' : 'scheduled',
          recipient: user.name || 'Unknown User',
          recipientId: user.id,
          createdBy: 'admin' // In a real app, this would be the current user
        };
        
        newNotifications.push(notification);
      });

      // In a real app, you would save these to the database here
      // await supabase.from('notifications').insert(newNotifications);

      return newNotifications;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Get notification statistics
   */
  static async getNotificationStats(): Promise<{
    total: number;
    sent: number;
    scheduled: number;
    pending: number;
  }> {
    try {
      const notifications = await this.getAllNotifications();
      
      return {
        total: notifications.length,
        sent: notifications.filter(n => n.status === 'sent').length,
        scheduled: notifications.filter(n => n.status === 'scheduled').length,
        pending: notifications.filter(n => n.status === 'pending').length,
      };
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw error;
    }
  }

  /**
   * Search notifications
   */
  static async searchNotifications(query: string): Promise<Notification[]> {
    try {
      const notifications = await this.getAllNotifications();
      
      return notifications.filter(notification => 
        notification.title.toLowerCase().includes(query.toLowerCase()) ||
        notification.message.toLowerCase().includes(query.toLowerCase()) ||
        notification.recipient.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching notifications:', error);
      throw error;
    }
  }

  /**
   * Filter notifications by status and type
   */
  static async filterNotifications(
    statusFilter: string = 'all',
    typeFilter: string = 'all'
  ): Promise<Notification[]> {
    try {
      const notifications = await this.getAllNotifications();
      
      return notifications.filter(notification => {
        const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
        const matchesType = typeFilter === 'all' || notification.type === typeFilter;
        
        return matchesStatus && matchesType;
      });
    } catch (error) {
      console.error('Error filtering notifications:', error);
      throw error;
    }
  }
}
