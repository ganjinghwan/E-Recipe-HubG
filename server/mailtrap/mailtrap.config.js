import { MailtrapClient } from "mailtrap";

const TOKEN = "1831ccb45bf0c193014c16d40703b5d4";

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
  endpoint: "https://api.mailtrap.io",
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "MMU SoftEngin group",
};