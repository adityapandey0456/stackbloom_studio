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
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASS;
  const recipient = process.env.ENQUIRY_NOTIFY_EMAIL?.trim();
  const port = Number(process.env.SMTP_PORT || "465");

  if (
    !host ||
    !user ||
    !password ||
    !recipient ||
    ![465, 587].includes(port)
  ) {
    console.error("ENQUIRY_EMAIL_CONFIGURATION_INVALID");
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: {
      user,
      pass: password,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  try {
    const result = await transporter.sendMail({
      from: {
        name: "StackBloom Studio",
        address: user,
      },
      to: recipient,
      replyTo: {
        name: enquiry.name.replace(/[\r\n]/g, " "),
        address: enquiry.email,
      },
      subject: `New project enquiry: ${enquiry.service.replace(
        /[\r\n]/g,
        " "
      )}`,
      text: [
        "STACKBLOOM STUDIO",
        "New project enquiry",
        "",
        `Reference: ${enquiry.id}`,
        `Name: ${enquiry.name}`,
        `Email: ${enquiry.email}`,
        `Service: ${enquiry.service}`,
        "",
        "Project details:",
        enquiry.message,
        "",
        "Open your admin dashboard:",
        "https://stackbloomstudio.space/admin",
        "",
        "Reply to this email to respond to the customer.",
      ].join("\n"),
    });

    if (!result.accepted?.length) {
      console.error("ENQUIRY_EMAIL_NOT_ACCEPTED", {
        reference: enquiry.id,
      });
      return false;
    }

    return true;
  } catch (error: unknown) {
    const smtpError = error as {
      code?: string;
      responseCode?: number;
      command?: string;
    } | null;

    console.error("ENQUIRY_EMAIL_FAILED", {
      reference: enquiry.id,
      code: smtpError?.code,
      responseCode: smtpError?.responseCode,
      command: smtpError?.command,
    });

    return false;
  } finally {
    transporter.close();
  }
}