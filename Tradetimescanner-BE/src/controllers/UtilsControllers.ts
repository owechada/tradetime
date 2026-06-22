import Mailgun from "mailgun.js";
import formData from "form-data";
interface EmailOptionsDTO {
  subject: string;
  to: string;
  from: string;
  body: string;
}
const SendEmail = async ({ subject, to, from, body }: EmailOptionsDTO) => {
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_KEY,
  });
  console.log(to, "toot");
  mg.messages
    .create("app.tradetimescanner.com", {
      from: "Trade Time Scanner <notifications@tradetimescanner.com>",
      to: [`${to}`],
      subject: subject,
      html: body,
    })
    .then((msg) => {
      console.log(msg);
    }) // logs response data
    .catch((err) => console.error(err)); // logs any error
};

export { SendEmail };
