import React, { useState } from "react";
import {
  Star,
  CheckSquare,
  Circle,
  Clock,
  Users,
  Eye,
  Edit,
  Coins,
} from "lucide-react";

const OfferNotificationsManagement = () => {
  const [offers, setOffers] = useState([
    {
      id: 1,
      title: "Complete Profile Survey",
      type: "Survey",
      icon: <Star className="w-4 h-4" />,
      colorScheme: "Ocean Breeze",
      colorIndicator: "bg-blue-500",
      description:
        "Help us improve your experience by completing this quick survey about your preferences.",
      reward: 50,
      rewardType: "coins",
      urgency: null,
      status: "active",
      target: "All Users",
      completions: 89,
      responses: 127,
      expires: "10/15/2024",
      display: "24h",
    },
    {
      id: 2,
      title: "Refer a Friend Challenge",
      type: "Task",
      icon: <CheckSquare className="w-4 h-4" />,
      colorScheme: "Forest Fresh",
      colorIndicator: "bg-green-500",
      description:
        "Invite friends to join WallPe and earn rewards for each successful referral.",
      reward: 100,
      rewardType: "₹",
      urgency: "high",
      status: "active",
      target: "Premium Users",
      completions: 23,
      responses: 45,
      expires: "11/1/2024",
      display: "Until done",
    },
  ]);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "active":
        return "bg-black text-white";
      case "paused":
        return "bg-gray-500 text-white";
      case "expired":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  const getRewardBadgeColor = (rewardType) => {
    if (rewardType === "coins") {
      return "bg-yellow-100 text-yellow-700";
    }
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen mt-5 bg-white border rounded-xl p-6">
      <div className="mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl  text-gray-900">
            Offer Notifications Management
          </h1>
        </div>

        <div className="space-y-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {offer.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {offer.icon}
                    <span className="text-sm text-gray-600">{offer.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-3 h-3 rounded-full ${offer.colorIndicator}`}
                    ></div>
                    <span className="text-sm text-gray-600">
                      {offer.colorScheme}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {offer.urgency === "high" && (
                    <div className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      <span>⚠</span>
                      <span>high</span>
                    </div>
                  )}
                  <div
                    className={`px-3 py-1 rounded text-xs font-medium ${getRewardBadgeColor(
                      offer.rewardType
                    )}`}
                  >
                    {offer.rewardType === "coins" ? (
                      <div className="flex items-center gap-1">
                        <Coins className="w-3 h-3" />
                        <span>{offer.reward} coins</span>
                      </div>
                    ) : (
                      <span>
                        {offer.rewardType}
                        {offer.reward}
                      </span>
                    )}
                  </div>
                  <div
                    className={`px-3 py-1 rounded text-xs font-medium ${getStatusBadgeColor(
                      offer.status
                    )}`}
                  >
                    {offer.status}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">{offer.description}</p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Target</p>
                  <p className="text-sm font-medium text-gray-900">
                    {offer.target}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Responses</p>
                  <p className="text-sm font-medium text-gray-900">
                    {offer.responses}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Completions</p>
                  <p className="text-sm font-medium text-gray-900">
                    {offer.completions}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Expires</p>
                  <p className="text-sm font-medium text-gray-900">
                    {offer.expires}
                  </p>
                </div>
              </div>

              {/* Theme and Display */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Theme</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${offer.colorIndicator}`}
                    ></div>
                    <span className="text-sm font-medium text-gray-900">
                      {offer.colorScheme}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Display</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">
                      {offer.display}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfferNotificationsManagement;
