import { useState, useEffect } from "react";

type NotificationProps = {
  message: string;
  type?: "success" | "error";
  duration?: number;
  onComplete?: () => void;
};

const Notification = ({ message, type = "success", duration = 3000, onComplete }: NotificationProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <div
      className={`
          fixed top-4 right-4 p-6 rounded-lg shadow-xl transition-all duration-300
          ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
          ${type === "success" ? "bg-green-500" : "bg-red-500"}
          z-50
        `}
    >
      {message}
    </div>
  );
};

export default Notification;
