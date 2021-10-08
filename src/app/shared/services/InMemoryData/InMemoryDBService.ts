import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  constructor() {}
  createDb() {
    const contacts = [
      {
        id: 1,
        firstName: 'Zulfiqar',
        lastName: 'Syed1',
        phoneNumber: '714-555-1212',
        emailAddress: 'myemailzulfiqar@mydomain.com'
      },
      {
        id: 2,
        firstName: 'Sobia',
        lastName: 'Syed2',
        phoneNumber: '714-555-1313',
        emailAddress: 'myemailsobia@mydomain.com'
      },
      {
        id: 3,
        firstName: 'Lenah',
        lastName: 'Syed3',
        phoneNumber: '714-555-1414',
        emailAddress: 'myemailLenah@mydomain.com'
      }
    ];
    const reminders = [
      {
        id: 1,
        firstName: 'Zulfiqar',
        lastName: 'Syed1',
        phoneNumber: '714-555-1212',
        emailAddress: 'myemailzulfiqar@mydomain.com',
        frequency: "Once",
        date: "10/4/2021",
        time: "9:10 AM",
        message: "reminder message 1"
      },
      {
        id: 2,
        firstName: 'Daniya',
        lastName: 'Syed4',
        phoneNumber: '714-555-1515',
        emailAddress: 'myemailDaniya@mydomain.com',
        frequency: "Daily",
        time: "8:40 AM",
        message: "reminder message 4"
      },
      {
        id: 3,
        firstName: 'Sobia',
        lastName: 'Syed2',
        phoneNumber: '714-555-1313',
        emailAddress: 'myemailsobia@mydomain.com',
        frequency: "Weekly",
        weekday: "Tuesday",
        time: "11:10 AM",
        message: "reminder message 2"
      },
      {
        id: 4,
        firstName: 'Lenah',
        lastName: 'Syed3',
        phoneNumber: '714-555-1414',
        emailAddress: 'myemailLenah@mydomain.com',
        frequency: "Monthly",
        day: "14",
        time: "10:40 AM",
        message: "reminder message 3"
      },
      {
        id: 5,
        firstName: 'Nadiya',
        lastName: 'Syed3',
        phoneNumber: '714-555-1717',
        emailAddress: 'myemailNadiya@mydomain.com',
        frequency: "MonthWeekly",
        week: "Second",
        weekday: "Thursday",
        day: "",
        time: "10:40 AM",
        message: "reminder message 3"
      },
      {
        id: 6,
        firstName: 'Nuha',
        lastName: 'Syed5',
        phoneNumber: '714-555-1616',
        emailAddress: 'myemailNuha@mydomain.com',
        frequency: "Yearly",
        month: "October",
        day: "10",
        time: "9:40 AM",
        message: "reminder message 5"
      }
    ];
    return { contacts, reminders };
  }
}
