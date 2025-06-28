"use client";

import React, { useState } from "react";
import { usePetShopProfile } from "@/hooks/usePetShopProfile";
import { ProfileForm } from "./components/ProfileForm";
import { ProfileFormData } from "./schema";
import { Settings, Save } from "lucide-react";

export default function ProfilePage() {
  const { profile, loading, saveProfile, updateProfile } = usePetShopProfile();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      if (profile) {
        await updateProfile(data);
      } else {
        await saveProfile(data);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando configurações...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Configurações do Perfil
          </h1>
          <p className="text-gray-600">
            Configure as informações do seu pet shop
          </p>
        </div>
        <div className="flex gap-2 items-center text-blue-600">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Perfil</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <ProfileForm
            profile={profile}
            onSubmit={handleSubmit}
            loading={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
