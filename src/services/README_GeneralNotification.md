# General Notification Service

This service handles general notifications for the WallPe admin panel, including creating, managing, and sending notifications to users through the Supabase database.

## Features

- ✅ Create and manage general notifications
- ✅ Upload media files to Supabase storage
- ✅ Support for different recipient types (all_users, individual, groups, smart_filter)
- ✅ Support for different delivery types (in-app, push, both)
- ✅ Media support (images, GIFs, files, videos)
- ✅ Deep links and external URLs
- ✅ Scheduled notifications
- ✅ Search and filtering capabilities
- ✅ Notification statistics

## Database Schema

The service works with the `general_notification` table:

```sql
create table public.general_notification (
  id uuid not null default gen_random_uuid (),
  title text not null,
  description text null,
  noti_type text not null,
  media_url text null,
  deep_link text null,
  external_url text null,
  delivery_type text null,
  recipient_type text null,
  recipient_id uuid null default gen_random_uuid (),
  created_at timestamp without time zone null,
  scheduled_at timestamp without time zone null,
  is_read boolean null default false,
  constraint general_notification_pkey primary key (id),
  constraint general_notification_recipient_id_fkey foreign KEY (recipient_id) references profile (id)
) TABLESPACE pg_default;
```

## Usage

### Basic Usage

```typescript
import { GeneralNotificationService } from './generalNotificationService';

// Create a notification
const notification = await GeneralNotificationService.createNotification({
  title: 'Welcome to WallPe!',
  description: 'Thank you for joining our platform.',
  noti_type: 'info',
  delivery_type: 'both',
  recipient_type: 'all_users'
});

// Get all notifications
const notifications = await GeneralNotificationService.getAllNotifications();

// Upload media
const file = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
const uploadResult = await GeneralNotificationService.uploadMedia(file);
```

### Advanced Usage

```typescript
// Send notification immediately
const immediateNotification = await GeneralNotificationService.sendNotificationNow({
  title: 'Urgent Update',
  description: 'Please update your app immediately.',
  noti_type: 'warning',
  delivery_type: 'push',
  recipient_type: 'all_users'
});

// Schedule notification for later
const scheduledNotification = await GeneralNotificationService.scheduleNotification({
  title: 'Reminder',
  description: 'Don\'t forget to complete your profile.',
  noti_type: 'info',
  delivery_type: 'in-app',
  recipient_type: 'individual',
  recipient_id: 'user-uuid-here'
}, '2024-12-31T23:59:59');

// Search notifications
const searchResults = await GeneralNotificationService.searchNotifications('welcome');

// Filter notifications
const filteredNotifications = await GeneralNotificationService.filterNotifications(
  'info',     // notification type
  'all_users', // recipient type
  false       // is_read status
);

// Get statistics
const stats = await GeneralNotificationService.getNotificationStats();
```

## API Reference

### GeneralNotificationService

#### Methods

- `uploadMedia(file: File): Promise<MediaUploadResult>`
  - Uploads a media file to Supabase storage
  - Returns the public URL and file path

- `createNotification(data: GeneralNotificationCreate): Promise<GeneralNotification>`
  - Creates a new notification in the database

- `getAllNotifications(): Promise<GeneralNotification[]>`
  - Retrieves all notifications ordered by creation date

- `getNotificationById(id: string): Promise<GeneralNotification | null>`
  - Retrieves a specific notification by ID

- `updateNotification(id: string, updates: Partial<GeneralNotificationCreate>): Promise<GeneralNotification>`
  - Updates an existing notification

- `deleteNotification(id: string): Promise<void>`
  - Deletes a notification

- `markAsRead(id: string): Promise<void>`
  - Marks a notification as read

- `getNotificationsByRecipientType(recipientType: string): Promise<GeneralNotification[]>`
  - Gets notifications by recipient type

- `getNotificationsByRecipientId(recipientId: string): Promise<GeneralNotification[]>`
  - Gets notifications by specific recipient ID

- `getNotificationStats(): Promise<NotificationStats>`
  - Returns notification statistics

- `searchNotifications(query: string): Promise<GeneralNotification[]>`
  - Searches notifications by title or description

- `filterNotifications(notiType?: string, recipientType?: string, isRead?: boolean): Promise<GeneralNotification[]>`
  - Filters notifications by various criteria

- `sendNotificationNow(data: GeneralNotificationCreate): Promise<GeneralNotification>`
  - Sends notification immediately

- `scheduleNotification(data: GeneralNotificationCreate, scheduledAt: string): Promise<GeneralNotification>`
  - Schedules notification for later delivery

### Types

#### GeneralNotification
```typescript
interface GeneralNotification {
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
```

#### GeneralNotificationCreate
```typescript
interface GeneralNotificationCreate {
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
```

#### MediaUploadResult
```typescript
interface MediaUploadResult {
  url: string;
  path: string;
}
```

## Storage Configuration

The service uploads media files to the `wallpe-assets` bucket in Supabase storage under the `general_notification/` folder. Make sure this bucket exists and has the appropriate permissions.

## Error Handling

All methods include proper error handling and will throw descriptive errors if operations fail. Always wrap service calls in try-catch blocks:

```typescript
try {
  const notification = await GeneralNotificationService.createNotification(data);
  console.log('Notification created:', notification.id);
} catch (error) {
  console.error('Failed to create notification:', error);
}
```

## Testing

Use the provided test file to verify the service works correctly:

```typescript
import { testGeneralNotificationService } from './testGeneralNotification';

// Run tests
testGeneralNotificationService();
```

## Integration with UI

The service is integrated with the `NotificationsPageUpdated.tsx` component, providing a complete UI for managing notifications with:

- Form for creating notifications
- Media upload with progress indication
- Preview of notifications
- Table view with search and filtering
- Support for all notification types and recipient types

