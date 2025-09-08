"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authStore } from "@/lib/auth";
import NotificationList from "@/components/ui/notification";

const AdviserNotificationsPage = () => {
  const router = useRouter();

  useEffect(() => {
    const user = authStore.getUser();
    if (
      !authStore.isAuthenticated() ||
      user?.role.toLowerCase() !== "adviser"
    ) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div>
      <NotificationList />
    </div>
  );
};

export default AdviserNotificationsPage;
