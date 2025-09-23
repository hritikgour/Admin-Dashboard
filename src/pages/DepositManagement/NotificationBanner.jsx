import React from "react";

const NotificationBanner = ({ message }) => {
  return (
    <div className="notification">
      {message}
    </div>
  );
};

export default NotificationBanner;
