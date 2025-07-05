"use client";

import React, { useState } from "react";
import {
  usePetShopProfile,
  useCreateProfile,
  useUpdateProfile,
} from "@/hooks/queries/usePetShopProfileQuery";
import { ProfileForm } from "./components/ProfileForm";
import { ProfileFormData } from "./schema";
import { Settings } from "lucide-react";

export default function ProfilePage() {
  const { data: profile, isLoading } = usePetShopProfile();
  const createProfileMutation = useCreateProfile();
  const updateProfileMutation = useUpdateProfile();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      if (profile) {
        updateProfileMutation.mutate(
          { id: profile.id, data },
          {
            onSuccess: () => {
              setIsSaving(false);
            },
            onError: () => {
              setIsSaving(false);
            },
          }
        );
      } else {
        createProfileMutation.mutate(data, {
          onSuccess: () => {
            setIsSaving(false);
          },
          onError: () => {
            setIsSaving(false);
          },
        });
      }
    } catch (error) {
      setIsSaving(false);
    }
  };

  if (isLoading) {
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
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <ProfileForm
            profile={profile || null}
            onSubmit={handleSubmit}
            loading={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
