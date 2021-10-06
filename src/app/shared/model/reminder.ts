export interface Reminder {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  date?: string | null;
  weekday?: string;
  day?: string;
  month?: string;
  frequency?: string;
  time?: string;
  message?: string;
}


