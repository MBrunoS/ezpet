"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createDefaultPetShopProfile = async (
  userId: string,
  userName: string
) => {
  try {
    const defaultProfile = {
      userId,
      name: `${userName}'s Pet Shop`,
      phone: "",
      address: {
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
      },
      workingHours: [
        { day: "monday", isOpen: true, openTime: "08:00", closeTime: "18:00" },
        { day: "tuesday", isOpen: true, openTime: "08:00", closeTime: "18:00" },
        {
          day: "wednesday",
          isOpen: true,
          openTime: "08:00",
          closeTime: "18:00",
        },
        {
          day: "thursday",
          isOpen: true,
          openTime: "08:00",
          closeTime: "18:00",
        },
        { day: "friday", isOpen: true, openTime: "08:00", closeTime: "18:00" },
        {
          day: "saturday",
          isOpen: true,
          openTime: "08:00",
          closeTime: "18:00",
        },
        { day: "sunday", isOpen: false, openTime: "08:00", closeTime: "18:00" },
      ],
      lunchStart: "",
      lunchEnd: "",
      appointmentCapacity: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await addDoc(collection(db, "petShopProfiles"), defaultProfile);
    console.log("Perfil padrão do pet shop criado automaticamente");
  } catch (error) {
    console.error("Erro ao criar perfil padrão:", error);
  }
};

const checkAndCreateProfile = async (user: User) => {
  try {
    const profileRef = collection(db, "petShopProfiles");
    const q = query(profileRef, where("userId", "==", user.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Usuário não tem perfil, criar um padrão
      const userName =
        user.displayName || user.email?.split("@")[0] || "Usuário";
      await createDefaultPetShopProfile(user.uid, userName);
      toast.success(
        "Perfil do pet shop criado automaticamente! Configure suas informações na página de perfil."
      );
    }
  } catch (error) {
    console.error("Erro ao verificar/criar perfil:", error);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Verificar se é um novo usuário e criar perfil se necessário
        await checkAndCreateProfile(user);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
      toast.error("Erro ao fazer login com Google");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
