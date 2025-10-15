import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import {
  Gift,
  Eye,
  Globe,
  User,
  Users,
  Filter,
  CheckCircle2,
  Smartphone,
  AlertCircle,
  Palette,
  Clock,
  Star,
  Search,
  Loader2,
  Target,
} from "lucide-react";
import OfferNotificationsManagement from "./ManagementOfferNotification";

const colorSchemes = {
  oceanBreeze: {
    name: "Ocean Breeze",
    icon: "🌊",
    gradient: "from-blue-500 to-purple-600",
    color: "#4F46E5",
  },
  forestFresh: {
    name: "Forest Fresh",
    icon: "✓",
    gradient: "from-green-400 to-teal-500",
    color: "#10B981",
  },
  sunsetGlow: {
    name: "Sunset Glow",
    icon: "🌅",
    gradient: "from-orange-400 to-red-500",
    color: "#F97316",
  },
  berryBlast: {
    name: "Berry Blast",
    icon: "🍇",
    gradient: "from-pink-500 to-purple-600",
    color: "#EC4899",
  },
  midnightGold: {
    name: "Midnight Gold",
    icon: "✨",
    gradient: "from-gray-800 to-yellow-600",
    color: "#78350F",
  },
  rainbowMagic: {
    name: "Rainbow Magic",
    icon: "🌈",
    gradient: "from-pink-400 to-blue-500",
    color: "#F472B6",
  },
};

const colorSchemeKeys = Object.keys(colorSchemes);
const defaultScheme = colorSchemeKeys[0];

const OfferNotification = () => {
  const [formData, setFormData] = useState({
    title: "",
    type: "Survey",
    description: "",
    rewardType: "Coins",
    rewardAmount: "50",
    expiryDate: "",
    recipients: "all",
    recipient_id: [],
    colorScheme: [defaultScheme], // always array
    urgencyLevel: "high",
    displayDuration: "24",
    enableAutoReminders: false,
  });

  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sync selectedUsers with formData.recipient_id
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      recipient_id: selectedUsers,
    }));
  }, [selectedUsers]);

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
      (user.phone && user.phone.toLowerCase().includes(query))
    );
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // always set colorScheme as array with one element
  const handleColorSchemeChange = (scheme) => {
    setFormData((prev) => ({
      ...prev,
      colorScheme: [scheme],
    }));
  };

  const handleRecipientChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      recipients: type,
      recipient_id: [],
    }));
    setSelectedUsers([]);
    setShowUserList(type === "individual");
  };

  const handleUserToggle = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Insert function
  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(false);

    const color_schema_value =
      formData.colorScheme &&
      Array.isArray(formData.colorScheme) &&
      formData.colorScheme.length > 0
        ? formData.colorScheme
        : [defaultScheme];

    // Map formData to DB columns
    const insertData = {
      title: formData.title,
      type: formData.type,
      description: formData.description,
      reward_type: formData.rewardType,
      reward_amount: formData.rewardAmount,
      exp_date: formData.expiryDate,
      recipients_type: formData.recipients,
      recipients_id: formData.recipient_id,
      color_schema: color_schema_value,
      urgency_level: formData.urgencyLevel,
      urgency_duration: formData.displayDuration,
      enable_auto_reminders: formData.enableAutoReminders,
    };

    const { data, error } = await supabase
      .from("offer_notification")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      setSubmitError(error.message);
    } else {
      setSubmitSuccess(true);
      setFormData({
        title: "",
        type: "Survey",
        description: "",
        rewardType: "Coins",
        rewardAmount: "50",
        expiryDate: "",
        recipients: "all",
        recipient_id: [],
        colorScheme: [defaultScheme],
        urgencyLevel: "high",
        displayDuration: "24",
        enableAutoReminders: false,
      });
      setSelectedUsers([]);
    }
  };

  return (
    <>
      <div className="flex gap-6 w-full p-1 bg-gray-50 min-h-screen">
        <div className="w-full lg:w-1/2 bg-white rounded-xl border border-gray-300 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Gift className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Create Offer Notification</h2>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Offer notification title..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="Survey">Survey</option>
              <option value="Task">Task</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter offer description..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reward Type
              </label>
              <select
                name="rewardType"
                value={formData.rewardType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="Coins">Coins</option>
                <option value="Points">Points</option>
                <option value="Discount">Discount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reward Amount
              </label>
              <input
                type="number"
                name="rewardAmount"
                value={formData.rewardAmount}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              placeholder="mm/dd/yyyy"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Recipients Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5" />
              <label className="text-sm font-medium text-gray-700">
                Select Recipients
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => handleRecipientChange("all")}
                className={`px-4 py-2 rounded-lg border font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
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
                className={`px-4 py-2 rounded-lg border font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
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
                className={`px-4 py-2 rounded-lg border font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                  formData.recipients === "groups"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Users className="w-4 h-4" />
                Groups
              </button>
              <button
                type="button"
                onClick={() => handleRecipientChange("smart")}
                className={`px-4 py-2 rounded-lg border font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
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
            {formData.recipients === "individual" && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Select Individual Users
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowUserList(!showUserList)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {showUserList ? "Hide List" : "Show List"}
                  </button>
                </div>
                {showUserList && (
                  <div>
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                      {loading ? (
                        <div className="flex items-center justify-center p-8">
                          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
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
                            className="flex items-center gap-3 p-3 border-b last:border-b-0 hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => handleUserToggle(user.id)}
                              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {user.name || "Unnamed User"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {user.phone}
                              </div>
                            </div>
                            <span className="px-2 py-1 bg-gray-900 text-white rounded text-xs font-medium">
                              {user.status || "Active"}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
                {selectedUsers.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-700">
                        {selectedUsers.length} user
                        {selectedUsers.length > 1 ? "s" : ""} selected
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Summary for non-individual selections */}
            {formData.recipients !== "individual" && (
              <>
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

          {/* Design & Display Options Section */}
          <div className="mb-6 border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5" />
              <h3 className="text-lg font-semibold">
                Design & Display Options
              </h3>
            </div>
            {/* Color Scheme */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color Scheme
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(colorSchemes).map(([key, scheme]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleColorSchemeChange(key)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.colorScheme[0] === key
                        ? "border-gray-900 ring-2 ring-gray-900 ring-offset-2"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`h-8 rounded-md bg-gradient-to-r ${scheme.gradient} mb-2`}
                    ></div>
                    <div className="flex items-center gap-2 text-sm">
                      <span>{scheme.icon}</span>
                      <span className="font-medium text-gray-700">
                        {scheme.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency Level */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level
              </label>
              <select
                name="urgencyLevel"
                value={formData.urgencyLevel}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            {/* Display Duration */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Duration
              </label>
              <select
                name="displayDuration"
                value={formData.displayDuration}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="12">12 Hours</option>
                <option value="24">24 Hours</option>
                <option value="48">48 Hours</option>
                <option value="72">72 Hours</option>
              </select>
            </div>
            {/* Enable Auto Reminders */}
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                name="enableAutoReminders"
                checked={formData.enableAutoReminders}
                onChange={handleInputChange}
                className="mr-2 w-4 h-4 border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700">
                Enable Auto Reminders
              </label>
            </div>
          </div>
          {/* Create Button */}
          <button
            type="button"
            className="mb-5 w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            onClick={handleSubmit}
          >
            <Gift className="w-5 h-5" />
            Create Offer Notification
          </button>

          {submitSuccess && (
            <div className="p-2 mb-4 bg-green-100 text-green-800 rounded text-center">
              Offer notification created successfully!
            </div>
          )}
          {submitError && (
            <div className="p-2 mb-4 bg-red-100 text-red-700 rounded text-center">
              {submitError}
            </div>
          )}
        </div>
        {/* Right Panel - Preview */}
        <div className="w-full lg:w-1/2 bg-white rounded-xl border border-gray-300 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Eye className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Offer Preview</h2>
          </div>
          <div className="flex justify-center items-start h-full">
            {formData.title || formData.description ? (
              <div className="max-w-sm w-full">
                <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                  <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                  <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                  <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
                    <div className="p-4 bg-gradient-to-b from-gray-50 to-white h-full">
                      <div className="mb-3 text-center">
                        <p className="text-xs text-gray-500 font-medium">
                          Wallet
                        </p>
                      </div>
                      <div
                        className={`bg-gradient-to-br ${
                          colorSchemes[formData.colorScheme[0]].gradient
                        } rounded-2xl shadow-lg p-4`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-white" />
                            <span className="text-white text-sm font-semibold">
                              {formData.type}
                            </span>
                          </div>
                          {formData.urgencyLevel === "high" && (
                            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              HIGH
                            </div>
                          )}
                          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                            <span className="text-yellow-300 text-lg">●</span>
                            <span className="text-white text-sm font-bold">
                              {formData.rewardAmount}
                            </span>
                            <span className="text-white text-xs">
                              {formData.rewardType.toLowerCase()}
                            </span>
                          </div>
                        </div>
                         <p className="text-lg text-white/90 mb-3">
                          {formData.title || ""}
                        </p>
                        <p className="text-xs text-white/90 mb-3">
                          {formData.description || ""}
                        </p>
                        <div className="flex items-center gap-1 text-white/80 text-xs mb-3">
                          <Clock className="w-3 h-3" />
                          <span>Shows for: {formData.displayDuration}h</span>
                        </div>
                        <button className="w-full bg-white text-gray-800 font-medium py-2 px-4 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                          {formData.type === "Survey"
                            ? "Take Survey"
                            : "Claim Offer"}
                        </button>
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
                  Fill out the form above to see a live preview of your offer
                  notification
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg inline-flex">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    Tip: Add a title and description to see how your offer will
                    appear in the mobile app
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <OfferNotificationsManagement />
    </>
  );
};

export default OfferNotification;
