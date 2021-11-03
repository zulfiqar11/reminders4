import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  constructor() {}
  createDb() {
    const contactsList = [
      {
        id: 1,
        listName: 'My First List',
        contactsCount: 3,
        addedDate: '11/01/2021 04:55 AM'
      },
      {
        id: 2,
        listName: 'My Second List',
        contactsCount: 4,
        addedDate: '10/11/2021 05:30 PM'
      },
      {
        id: 3,
        listName: 'My Third List',
        contactsCount: 2,
        addedDate: '10/11/2021 05:30 PM'
      }
    ]
    const contactsListDetails = [
      {
        id: 1,
        contactsListId : 1,
        firstName: 'cont1first1',
        lastName: 'cont1last1',
        phone: '7145551212',
        email: 'cont1@mydomain.com'
      },
      {
        id: 2,
        contactsListId : 1,
        firstName: 'cont2first1',
        lastName: 'cont2last1',
        phone: '7145551212',
        email: 'cont2@mydomain.com'
      },
      {
        id: 3,
        contactsListId : 2,
        firstName: 'cont3first1',
        lastName: 'cont3last1',
        phone: '7145551212',
        email: 'cont3@mydomain.com'
      },
      {
        id: 4,
        contactsListId : 2,
        firstName: 'cont4first1',
        lastName: 'cont4last1',
        phone: '7145551212',
        email: 'cont4@mydomain.com'
      },
      {
        id: 5,
        contactsListId : 3,
        firstName: 'cont5first1',
        lastName: 'cont5last1',
        phone: '7145551212',
        email: 'cont5@mydomain.com'
      },
      {
        id: 6,
        contactsListId : 3,
        firstName: 'cont6first1',
        lastName: 'cont6last1',
        phone: '7145551212',
        email: 'cont6@mydomain.com'
      }
    ]
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
    return { contacts, reminders, contactsList, contactsListDetails };
  }
}
