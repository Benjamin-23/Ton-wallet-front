export type NotifyType = "success" | "error" | "warning" | "default";

export type Notify = {
  type: NotifyType;
  message: string;
};

export interface INotification {
  notify: (params: Notify) => void;
}

export interface NotificationProviderProps {
  children: ReactNode;
}
