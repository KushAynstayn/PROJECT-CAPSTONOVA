import React from 'react'
import NotificationList from '@/components/ui/notification';

const myNotifications = [
    "Your files have been successfully submitted!",
  ];

const ProponentNotificationsPage = () => {
  return (
    <>
    <div>
      <NotificationList notifications={myNotifications} />
    </div>
    </>
  )
}

export default ProponentNotificationsPage
