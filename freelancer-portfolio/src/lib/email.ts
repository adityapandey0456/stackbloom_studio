import "server-only";
import nodemailer from "nodemailer";

type EnquiryNotification = {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
};

export async function notifyNewEnquiry(
  enquiry: EnquiryNotification
): Promise<boolean> {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    ENQUIRY_NOTIFY_EMAIL,
  } = process.env;

  if (
    !SMTP_HOST ||
    !SMTP_USER ||
    !SMTP_PASS ||
    !ENQUIRY_NOTIFY_EMAIL
  ) {
    console.error("Email notification configuration is missing.");
    return false;
  }

  const port = Number(SMTP_PORT || 465);

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  try {
    await transporter.sendMail({
      from: {
        name: "Aditya Portfolio",
        address: SMTP_USER,
      },
      to: ENQUIRY_NOTIFY_EMAIL,
      replyTo: enquiry.email,
      subject: `New project enquiry: ${enquiry.service}`,
      text: [
        "A new project enquiry has been saved.",
        "",
        `Reference: ${enquiry.id}`,
        `Name: ${enquiry.name}`,
        `Email: ${enquiry.email}`,
        `Service: ${enquiry.service}`,
        "",
        "Project details:",
        enquiry.message,
        "",
        "Open your admin dashboard to manage this enquiry.",
      ].join("\n"),
    });

    return true;
  } catch {
    console.error(
      `Email notification failed for enquiry ${enquiry.id}.`
    );
    return false;
  }
}