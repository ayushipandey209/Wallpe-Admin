import { supabase } from './supabase';

// Types for the general_notification table
export interface GeneralNotification {
  id: string;
  title: string;
  description: string | null;
  noti_type: string;
  media_url: string | null;
  deep_link: string | null;
  external_url: string | null;
  delivery_type: string | null;
  recipient_type: string | null;
  recipient_id: string | null;
  created_at: string | null;
  scheduled_at: string | null;
  is_read: boolean | null;
}

export interface GeneralNotificationCreate {
  title: string;
  description?: string;
  noti_type: string;
  media_url?: string;
  deep_link?: string;
  external_url?: string;
  delivery_type?: string;
  recipient_type: 'all_users' | 'individual' | 'groups' | 'smart_filter';
  recipient_id?: string;
  scheduled_at?: string;
}

export interface MediaUploadResult {
  url: string;
  path: string;
}

export class GeneralNotificationService {
  /**
   * Upload media file to Supabase storage
   */
  static async uploadMedia(file: File): Promise<MediaUploadResult> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `general_notification/${fileName}`;

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('wallpe-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('wallpe-assets')
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        path: filePath
      };
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }

  /**
   * Create a new general notification
   */
  static async createNotification(notificationData: GeneralNotificationCreate): Promise<GeneralNotification> {
    try {
      console.log('🚀 Creating notification with data:', notificationData);
      console.log('🔍 Raw noti_type from input:', notificationData.noti_type, '(type:', typeof notificationData.noti_type, ')');
      
      // Validate and ensure noti_type is correct
      const validTypes = ['info', 'success', 'warning', 'error'];
      const notiType = validTypes.includes(notificationData.noti_type) ? notificationData.noti_type : 'info';
      
      const insertData = {
        title: notificationData.title,
        description: notificationData.description || null,
        noti_type: notiType,
        media_url: notificationData.media_url || null,
        deep_link: notificationData.deep_link || null,
        external_url: notificationData.external_url || null,
        delivery_type: notificationData.delivery_type || null,
        recipient_type: notificationData.recipient_type,
        recipient_id: notificationData.recipient_id || null,
        created_at: new Date().toISOString(),
        scheduled_at: notificationData.scheduled_at || null,
        is_read: false
      };
      
      console.log('📝 Insert data:', insertData);
      console.log('🔍 noti_type in insertData:', insertData.noti_type, '(type:', typeof insertData.noti_type, ')');
      
      const { data, error } = await supabase
        .from('general_notification')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        throw new Error(`Failed to create notification: ${error.message}`);
      }

      console.log('✅ Notification created successfully:', data);
      console.log('🔍 Returned noti_type from database:', data.noti_type, '(type:', typeof data.noti_type, ')');
      return data;
    } catch (error) {
      console.error('❌ Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Get all general notifications
   */
  static async getAllNotifications(): Promise<GeneralNotification[]> {
    try {
      const { data, error } = await supabase
        .from('general_notification')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch notifications: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Get notification by ID
   */
  static async getNotificationById(id: string): Promise<GeneralNotification | null> {
    try {
      const { data, error } = await supabase
        .from('general_notification')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw new Error(`Failed to fetch notification: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching notification:', error);
      throw error;
    }
  }

  /**
   * Update notification
   */
  static async updateNotification(id: string, updates: Partial<GeneralNotificationCreate>): Promise<GeneralNotification> {
    try {
      const { data, error } = await supabase
        .from('general_notification')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update notification: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('general_notification')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete notification: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('general_notification')
        .update({ is_read: true })
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to mark notification as read: ${error.message}`);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Get notifications by recipient type
   */
  static async getNotificationsByRecipientType(recipientType: string): Promise<GeneralNotification[]> {
    try {
      const { data, error } = await supabase
        .from('general_notification')
        .select('*')
        .eq('recipient_type', recipientType)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch notifications: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching notifications by recipient type:', error);
      throw error;
    }
  }

  /**
   * Get notifications by recipient ID
   */
  static async getNotificationsByRecipientId(recipientId: string): Promise<GeneralNotification[]> {
    try {
      const { data, error } = await supabase
        .from('general_notification')
        .select('*')
        .eq('recipient_id', recipientId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch notifications: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching notifications by recipient ID:', error);
      throw error;
    }
  }

  /**
   * Get notification statistics
   */
  static async getNotificationStats(): Promise<{
    total: number;
    unread: number;
    by_type: Record<string, number>;
    by_recipient_type: Record<string, number>;
  }> {
    try {
      const notifications = await this.getAllNotifications();
      
      const stats = {
        total: notifications.length,
        unread: notifications.filter(n => !n.is_read).length,
        by_type: {} as Record<string, number>,
        by_recipient_type: {} as Record<string, number>
      };

      // Count by notification type
      notifications.forEach(notification => {
        stats.by_type[notification.noti_type] = (stats.by_type[notification.noti_type] || 0) + 1;
        stats.by_recipient_type[notification.recipient_type || 'unknown'] = 
          (stats.by_recipient_type[notification.recipient_type || 'unknown'] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw error;
    }
  }

  /**
   * Search notifications
   */
  static async searchNotifications(query: string): Promise<GeneralNotification[]> {
    try {
      const { data, error } = await supabase
        .from('general_notification')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to search notifications: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error searching notifications:', error);
      throw error;
    }
  }

  /**
   * Filter notifications by type and recipient type
   */
  static async filterNotifications(
    notiType?: string,
    recipientType?: string,
    isRead?: boolean
  ): Promise<GeneralNotification[]> {
    try {
      let query = supabase
        .from('general_notification')
        .select('*');

      if (notiType) {
        query = query.eq('noti_type', notiType);
      }

      if (recipientType) {
        query = query.eq('recipient_type', recipientType);
      }

      if (isRead !== undefined) {
        query = query.eq('is_read', isRead);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to filter notifications: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error filtering notifications:', error);
      throw error;
    }
  }

  /**
   * Send notification immediately (for "Send Now" functionality)
   */
  static async sendNotificationNow(notificationData: GeneralNotificationCreate): Promise<GeneralNotification> {
    try {
      // Set created_at to now and scheduled_at to null for immediate sending
      const immediateData = {
        ...notificationData,
        created_at: new Date().toISOString(),
        scheduled_at: undefined
      };

      return await this.createNotification(immediateData);
    } catch (error) {
      console.error('Error sending notification immediately:', error);
      throw error;
    }
  }

  /**
   * Schedule notification for later
   */
  static async scheduleNotification(notificationData: GeneralNotificationCreate, scheduledAt: string): Promise<GeneralNotification> {
    try {
      const scheduledData = {
        ...notificationData,
        scheduled_at: scheduledAt
      };

      return await this.createNotification(scheduledData);
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }
}

