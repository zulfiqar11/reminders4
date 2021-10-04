import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryContactService implements InMemoryDbService {
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
    return { contacts };
  }
}
