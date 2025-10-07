// Test file for GeneralNotificationService
import { GeneralNotificationService } from './generalNotificationService';

// Test function to verify the service works
export async function testGeneralNotificationService() {
  try {
    console.log('Testing GeneralNotificationService...');

    // Test 1: Get all notifications
    console.log('1. Testing getAllNotifications...');
    const notifications = await GeneralNotificationService.getAllNotifications();
    console.log('✓ getAllNotifications successful:', notifications.length, 'notifications found');

    // Test 2: Get notification stats
    console.log('2. Testing getNotificationStats...');
    const stats = await GeneralNotificationService.getNotificationStats();
    console.log('✓ getNotificationStats successful:', stats);

    // Test 3: Create a test notification
    console.log('3. Testing createNotification...');
    const testNotification = await GeneralNotificationService.createNotification({
      title: 'Test Notification',
      description: 'This is a test notification created by the service',
      noti_type: 'info',
      delivery_type: 'both',
      recipient_type: 'all_users'
    });
    console.log('✓ createNotification successful:', testNotification.id);

    // Test 4: Get notification by ID
    console.log('4. Testing getNotificationById...');
    const retrievedNotification = await GeneralNotificationService.getNotificationById(testNotification.id);
    console.log('✓ getNotificationById successful:', retrievedNotification?.title);

    // Test 5: Search notifications
    console.log('5. Testing searchNotifications...');
    const searchResults = await GeneralNotificationService.searchNotifications('test');
    console.log('✓ searchNotifications successful:', searchResults.length, 'results found');

    // Test 6: Filter notifications
    console.log('6. Testing filterNotifications...');
    const filteredNotifications = await GeneralNotificationService.filterNotifications('info', 'all_users');
    console.log('✓ filterNotifications successful:', filteredNotifications.length, 'results found');

    // Test 7: Mark as read
    console.log('7. Testing markAsRead...');
    await GeneralNotificationService.markAsRead(testNotification.id);
    console.log('✓ markAsRead successful');

    // Test 8: Delete test notification
    console.log('8. Testing deleteNotification...');
    await GeneralNotificationService.deleteNotification(testNotification.id);
    console.log('✓ deleteNotification successful');

    console.log('🎉 All tests passed! GeneralNotificationService is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Export for use in browser console or other test files
export default testGeneralNotificationService;

