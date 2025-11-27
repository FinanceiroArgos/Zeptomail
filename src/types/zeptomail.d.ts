declare module "zeptomail" {
  export class SendMailClient {
    constructor(url: string, token: string);
    sendMail(data: any): Promise<any>;
  }
}
