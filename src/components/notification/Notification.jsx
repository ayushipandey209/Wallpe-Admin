import React, { useState, useEffect } from "react";
import axios from "axios";
import GeneralNotification from "./GeneralNotification";
import OfferNotification from "./OfferNotification";
import { Bell, Gift } from "lucide-react";

export function Notifications() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="w-full min-h-screen">
      <div className="bg-[#ECECF0] rounded-full p-1 mb-6 mx-auto border mb-3">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center justify-center gap-2 px-6 py-1 font-medium text-sm transition-all flex-1 rounded-full ${
              activeTab === "general"
                ? "bg-white text-gray-900 "
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Bell className="w-5 h-5" />
            General Notifications
          </button>
          <button
            onClick={() => setActiveTab("offer")}
            className={`flex items-center justify-center gap-2 px-6 py-1 font-medium text-sm transition-all flex-1 rounded-full ${
              activeTab === "offer"
                ? "bg-white text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Gift className="w-5 h-5" />
            Offer Notifications
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {activeTab === "general" ? (
          <GeneralNotification />
        ) : (
          <OfferNotification />
        )}
      </div>
    </div>
  );
}
