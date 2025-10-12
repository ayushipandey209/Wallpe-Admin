import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import HistoryGeneralNotification from "./HistoryGeneralNotification";
import {
  Send,
  Eye,
  Link2,
  ExternalLink,
  Users,
  User,
  UsersRound,
  Filter,
  Globe,
  CheckCircle2,
  Bell,
  Smartphone,
  Calendar,
  Clock,
  AlertCircle,
  Search,
  Loader2,
  UserCheck,
} from "lucide-react";

const GeneralNotification = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    noti_type: "info",
    delivery_type: "both",
    media_type: "none",
    media_url: "",
    deep_link: "",
    external_url: "",
    recipients: "all",
    recipient_id: [], // Array to store selected user IDs
    schedule_type: "now",
    schedule_date: "",
  });

  console.log("FORMF: ", formData);

  const [showUserList, setShowUserList] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      recipient_id: selectedUsers,
    }));
  }, [selectedUsers]);

  console.log("selectedUsers: ", selectedUsers);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("profile")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setUsers(data || []);
        setTotalUsers(data?.length || 0);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(query)) ||
      (user.phone && user.phone.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query))
    );
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRecipientChange = (type) => {
    setFormData((prev) => ({ 
      ...prev, 
      recipients: type,
      recipient_id: [] // Reset recipient_id when changing type
    }));

    // Reset selection when changing recipient type
    if (type !== "individual") {
      setSelectedUsers([]);
      setShowUserList(false);
    }
  };

  const handleUserToggle = (userId, checked) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  const validateForm = () => {
    if (!formData.title || !formData.description) {
      alert("Please fill in both title and description fields");
      return false;
    }

    if (formData.recipients === "individual" && formData.recipient_id.length === 0) {
      alert("Please select at least one user");
      return false;
    }

    return true;
  };

  const handleSendNotification = async () => {
    if (!validateForm()) return;

    console.log("Form data to send:", formData);
    console.log("Selected user IDs:", formData.recipient_id);

    try {
      // Prepare insert data with recipient_id as array
      const insertData = {
        title: formData.title,
        description: formData.description,
        noti_type: formData.noti_type,
        media_url: formData.media_url || null,
        deep_link: formData.deep_link || null,
        external_url: formData.external_url || null,
        delivery_type: formData.delivery_type,
        recipient_type: formData.recipients,
        recipient_id: formData.recipients === "individual" ? formData.recipient_id : null,
        created_at: new Date().toISOString(),
        scheduled_at:
          formData.schedule_type === "later" && formData.schedule_date
            ? new Date(formData.schedule_date).toISOString()
            : null,
        is_read: false,
      };

      console.log("Inserting data:", insertData);

      const { data, error } = await supabase
        .from("general_notification")
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (formData.recipients === "individual") {
        alert(`Notification sent successfully to ${formData.recipient_id.length} user(s)!`);
      } else {
        alert("Notification sent successfully!");
      }

      setNotifications((prev) => [data, ...prev]);
      resetForm();
    } catch (error) {
      console.error("Error sending notification:", error);
      alert(`Failed to send notification: ${error.message || "Unknown error"}`);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      noti_type: "info",
      delivery_type: "both",
      media_type: "none",
      media_url: "",
      deep_link: "",
      external_url: "",
      recipients: "all",
      recipient_id: [],
      schedule_type: "now",
      schedule_date: "",
    });
    setSelectedUsers([]);
    setSearchQuery("");
    setShowUserList(false);
  };

  const renderIndividualSelection = () => (
    <div className="space-y-4 mt-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">Select Individual Users</span>
        </div>
        <button
          type="button"
          onClick={() => setShowUserList(!showUserList)}
          className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          {showUserList ? "Hide List" : "Show List"}
        </button>
      </div>

      {showUserList && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search users..."
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="max-h-64 overflow-y-auto border rounded-lg">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2 text-sm text-gray-500">
                  Loading users...
                </span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center p-8 text-red-600">
                <span className="text-sm">{error}</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center p-8 text-gray-500">
                <span className="text-sm">No users found</span>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-3 border-b last:border-b-0 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) =>
                      handleUserToggle(user.id, e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {user.name || "Unnamed User"}
                    </div>
                    <div className="text-xs text-gray-500">{user.phone}</div>
                    {user.email && (
                      <div className="text-xs text-gray-500">{user.email}</div>
                    )}
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {user.status || "Active"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-700">
              {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""}{" "}
              selected
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="flex gap-6 w-full p-1 bg-gray-50 min-h-screen">
        {/* Left Panel - Form */}
        <div className="w-full lg:w-1/2 bg-white rounded-xl border border-gray-300 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Send className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Send General Notification</h2>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Notification title..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              name="noti_type"
              value={formData.noti_type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter your notification message..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Delivery Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="delivery_type"
                  value="in-app"
                  checked={formData.delivery_type === "in-app"}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600"
                />
                <Smartphone className="w-4 h-4" />
                <span className="text-sm">In-App Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="delivery_type"
                  value="push"
                  checked={formData.delivery_type === "push"}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600"
                />
                <Bell className="w-4 h-4" />
                <span className="text-sm">Push Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="delivery_type"
                  value="both"
                  checked={formData.delivery_type === "both"}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600"
                />
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">Both</span>
              </label>
            </div>
          </div>

          {/* Media URL */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media URL (Optional)
            </label>
            <input
              type="text"
              name="media_url"
              value={formData.media_url}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Links */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Links (Optional)
            </label>

            <div className="mb-3">
              <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Link2 className="w-4 h-4" />
                Deep Link (opens in app)
              </label>
              <input
                type="text"
                name="deep_link"
                value={formData.deep_link}
                onChange={handleInputChange}
                placeholder="wallpe://profile, wallpe://wallet..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <ExternalLink className="w-4 h-4" />
                External URL (opens in browser)
              </label>
              <input
                type="text"
                name="external_url"
                value={formData.external_url}
                onChange={handleInputChange}
                placeholder="https://example.com..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Recipients */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Recipients
            </label>

            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">Select Recipients</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => handleRecipientChange("all")}
                className={`px-4 py-2 rounded-lg border font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                  formData.recipients === "all"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Globe className="w-4 h-4" />
                All Users
              </button>
              <button
                type="button"
                onClick={() => handleRecipientChange("individual")}
                className={`px-4 py-2 rounded-lg border font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                  formData.recipients === "individual"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <User className="w-4 h-4" />
                Individual
              </button>
              <button
                type="button"
                onClick={() => handleRecipientChange("groups")}
                className={`px-4 py-2 rounded-lg border font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                  formData.recipients === "groups"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <UsersRound className="w-4 h-4" />
                Groups
              </button>
              <button
                type="button"
                onClick={() => handleRecipientChange("smart")}
                className={`px-4 py-2 rounded-lg border font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                  formData.recipients === "smart"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Filter className="w-4 h-4" />
                Smart Filter
              </button>
            </div>

            {/* Individual User Selection */}
            {formData.recipients === "individual" &&
              renderIndividualSelection()}

            {/* Summary for non-individual selections */}
            {formData.recipients !== "individual" && (
              <>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium">
                      {formData.recipients === "all" && "All Users"}
                      {formData.recipients === "groups" && "Groups"}
                      {formData.recipients === "smart" && "Smart Filter"}
                    </span>
                  </div>
                </div>

                <div className="mt-3 p-4 bg-gray-100 rounded-lg text-center">
                  <div className="text-3xl font-bold text-gray-800">
                    {totalUsers}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total registered users
                  </div>
                </div>

                <div className="mt-3 p-3 bg-gray-200 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">
                    Estimated Recipients: {totalUsers}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Schedule */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Schedule
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="schedule_type"
                  value="now"
                  checked={formData.schedule_type === "now"}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600"
                />
                <Send className="w-4 h-4" />
                <span className="text-sm">Send Now</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="schedule_type"
                  value="later"
                  checked={formData.schedule_type === "later"}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600"
                />
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Schedule for Later</span>
              </label>
            </div>

            {formData.schedule_type === "later" && (
              <div className="mt-3">
                <input
                  type="datetime-local"
                  name="schedule_date"
                  value={formData.schedule_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSendNotification}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            {formData.schedule_type === "now" ? "Send Now" : "Schedule"}
          </button>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-full lg:w-1/2 bg-white rounded-xl border border-gray-300 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Eye className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Notification Preview</h2>
          </div>

          <div className="flex justify-center items-start h-full">
            {formData.title || formData.description ? (
              <div className="max-w-sm w-full">
                {/* Mobile Phone Frame */}
                <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                  <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                  <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                  <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
                    {/* Notification Content */}
                    <div className="p-4 bg-gradient-to-b from-gray-50 to-white h-full flex items-center justify-center">
                      <div className="bg-white rounded-2xl shadow-lg p-4 w-full border border-gray-200">
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                              formData.noti_type === "info"
                                ? "bg-blue-500"
                                : formData.noti_type === "success"
                                ? "bg-green-500"
                                : formData.noti_type === "warning"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          >
                            <Bell className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">
                              {formData.title || "Notification Title"}
                            </h3>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {formData.description ||
                                "Notification description will appear here"}
                            </p>
                            <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />
                              Just now
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center border border-dashed p-4 rounded-xl">
                <div className="mb-4">
                  <Smartphone className="w-24 h-24 mx-auto text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Preview Not Available
                </h3>
                <p className="text-sm text-gray-500">
                  Fill out the form above to see a live preview of your
                  notification
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg inline-flex">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    Tip: Add a title and description to see how your
                    notification will appear on mobile devices
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History */}
      <HistoryGeneralNotification notifications={notifications} />
    </>
  );
};

export default GeneralNotification;
