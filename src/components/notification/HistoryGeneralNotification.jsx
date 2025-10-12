import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { Loader2, Trash2, Eye } from "lucide-react";

const HistoryGeneralNotification = () => {
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications from Supabase
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("general_notification")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setNotificationHistory(data || []);
        setFilteredNotifications(data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notification history");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Filter notifications based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNotifications(notificationHistory);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = notificationHistory.filter(
      (notif) =>
        (notif.title && notif.title.toLowerCase().includes(query)) ||
        (notif.description && notif.description.toLowerCase().includes(query)) ||
        (notif.noti_type && notif.noti_type.toLowerCase().includes(query)) ||
        (notif.delivery_type && notif.delivery_type.toLowerCase().includes(query)) ||
        (notif.recipient_type && notif.recipient_type.toLowerCase().includes(query))
    );

    setFilteredNotifications(filtered);
  }, [searchQuery, notificationHistory]);

  // Format date from timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Get type badge color
  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-700";
      case "info":
        return "bg-blue-100 text-blue-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      case "error":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Get delivery badge color
  const getDeliveryBadgeColor = (deliveryType) => {
    switch (deliveryType) {
      case "push":
        return "bg-purple-100 text-purple-700";
      case "in-app":
        return "bg-blue-100 text-blue-700";
      case "both":
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Get recipient display text
  const getRecipientDisplay = (recipientType) => {
    switch (recipientType) {
      case "all":
        return "All Users";
      case "individual":
        return "Individual";
      case "groups":
        return "Groups";
      case "smart":
        return "Smart Filter";
      default:
        return recipientType || "-";
    }
  };

  // Determine status based on scheduled_at
  const getStatus = (scheduledAt) => {
    if (!scheduledAt) return "Sent";
    const scheduledDate = new Date(scheduledAt);
    const now = new Date();
    return scheduledDate > now ? "Scheduled" : "Sent";
  };

  // Handle delete notification
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("general_notification")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Remove from local state
      setNotificationHistory((prev) => prev.filter((notif) => notif.id !== id));
      alert("Notification deleted successfully!");
    } catch (err) {
      console.error("Error deleting notification:", err);
      alert("Failed to delete notification");
    }
  };

  // Handle view notification
  const handleView = (notification) => {
    alert(`
Title: ${notification.title}
Description: ${notification.description}
Type: ${notification.noti_type}
Delivery: ${notification.delivery_type}
Recipients: ${getRecipientDisplay(notification.recipient_type)}
    `);
  };

  return (
    <>
      <div className="mt-8 bg-white border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">
          General Notification History
        </h3>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-3 text-gray-500">Loading notifications...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-12 text-red-600">
            <span>{error}</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex items-center justify-center p-12 text-gray-500">
            <span>
              {searchQuery
                ? "No notifications match your search"
                : "No notification history found"}
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">
                    Delivery
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">
                    Media
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">
                    Recipients
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifications.map((notif) => (
                  <tr key={notif.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">
                      <div className="font-medium">{notif.title}</div>
                      <div className="text-gray-500 text-xs truncate max-w-xs">
                        {notif.description}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getTypeBadgeColor(
                          notif.noti_type
                        )}`}
                      >
                        {notif.noti_type}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getDeliveryBadgeColor(
                          notif.delivery_type
                        )}`}
                      >
                        {notif.delivery_type}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {notif.media_url ? (
                        <a
                          href={notif.media_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {getRecipientDisplay(notif.recipient_type)}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {formatDate(notif.created_at)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          getStatus(notif.scheduled_at) === "Scheduled"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-900 text-white"
                        }`}
                      >
                        {getStatus(notif.scheduled_at)}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(notif)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="View details"
                        >
                          <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Delete notification"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </>
  );
};

export default HistoryGeneralNotification;
