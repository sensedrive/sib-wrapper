const SibApiV3Sdk = require('sib-api-v3-typescript');

type ILists = Array<number>;

export class SibClass {
  email: string;
  apiKey: string;
  apiInstance: any;

  constructor(email: string, apiKey: string) {
    this.email = email;
    this.apiKey = apiKey;

    const apiInstance = new SibApiV3Sdk.ContactsApi();
    const apiK = apiInstance.authentications['apiKey'];
    apiK.apiKey = this.apiKey;
    this.apiInstance = apiInstance;
  }

  async delete() {
    const identifier = this.email;
    const contact = await this.getContact();

    if (contact) {
      await this.apiInstance.deleteContact(identifier);
    }
  }

  async removeContactFromLists(listIds: ILists) {
    const contact = await this.getContact();

    // Guard clauses.
    if (!contact) {
      return; // No contact, no removal needed. We are fine here.
    }

    // Code.
    const contactEmails = new SibApiV3Sdk.RemoveContactFromList();
    contactEmails.emails = [this.email];

    // Guard clauses.
    if (contact?.body?.listIds?.length < 1) return;

    const listIdIntersection = listIds.filter((x) =>
      contact.body.listIds.includes(x)
    );

    for (const listId of listIdIntersection) {
      await this.apiInstance.removeContactFromList(listId, contactEmails);
    }
  }

  async getContact() {
    const identifier = this.email;

    try {
      return await this.apiInstance.getContactInfo(identifier);
    } catch (e) {
      return false;
    }
  }

  async createContact(listId: number) {
    const createContact = new SibApiV3Sdk.CreateContact();

    createContact.email = this.email;
    createContact.listIds = [listId];

    return await this.apiInstance.createContact(createContact);
  }

  async addContact(listId: number) {
    let contact = await this.getContact();

    if (!contact) {
      await this.createContact(listId);
      contact = await this.getContact();
    } else if (!contact.body.listIds.includes(listId)) {
      const contactEmails = new SibApiV3Sdk.AddContactToList();
      contactEmails.emails = [this.email];

      await this.apiInstance.addContactToList(listId, contactEmails);
    }
  }
}
