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
        date: "10/4/2021",
        time: "9:10 AM",
        message: "reminder message 1"
      },
      {
        id: 2,
        firstName: 'Sobia',
        lastName: 'Syed2',
        phoneNumber: '714-555-1313',
        emailAddress: 'myemailsobia@mydomain.com',
        date: "11/4/2021",
        time: "11:10 AM",
        message: "reminder message 2"
      },
      {
        id: 3,
        firstName: 'Lenah',
        lastName: 'Syed3',
        phoneNumber: '714-555-1414',
        emailAddress: 'myemailLenah@mydomain.com',
        date: "12/4/2021",
        time: "10:40 AM",
        message: "reminder message 3"
      }
    ];
    return { contacts, reminders };
  }
}
