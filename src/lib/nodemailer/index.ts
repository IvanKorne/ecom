"use server";

import nodemailer from "nodemailer";
import { EmailContent, EmailProductInfo, NotificationType } from "@/types";
import screenshot from "../../assets/icons/Screenshot.png";

const Notification = {
  WELCOME: "WELCOME",
  CHANGE_OF_STOCK: "CHANGE_OF_STOCK",
  LOWEST_PRICE: "LOWEST_PRICE",
  THRESHOLD_MET: "THRESHOLD_MET",
};

export const generateEmailBody = async (
  product: EmailProductInfo,
  type: NotificationType
) => {
  const newTitle =
    product.title.length > 20
      ? `${product.title.substring(0, 20)}...`
      : product.title;

  let subject = "";
  let body = "";
  const THRESHOLD_PERCENTAGE = 30;

  switch (type) {
    case Notification.WELCOME:
      subject = `${newTitle} price tracking with eCom!`;
      body = `
        <div>
          <h2>Welcome to eCom</h2>
          <p>Right now, you are tracking ${product.title}.</p>
          <p>The way you'll get updates looks like this:</p>
          <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
            <h3>${product.title} is back in stock!</h3>
            <p>We are pleased to inform you that ${product.title} is once again available.</p>
            <p>Don't miss out - <a href="${product.productURL}" target="_blank" rel="noopener noreferrer">buy it now</a>!</p>
            <img src=${screenshot} alt="Product Image" style="max-width: 100%;" />
          </div>
          <p>Await further developments regarding ${product.title} and the other items you are following.</p>
        </div>
      `;
      break;

    case Notification.CHANGE_OF_STOCK:
      subject = `${newTitle} is now back in stock!`;
      body = `
        <div>
          <h4>Hey, ${product.title} is now restocked!Before they run out again, get yours!</h4>
          <p>See the product <a href="${product.productURL}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `;
      break;

    case Notification.LOWEST_PRICE:
      subject = `Lowest Price Alert for ${newTitle}`;
      body = `
        <div>
          <h4>Hey, ${product.title} has reached its lowest price ever!!</h4>
          <p>Grab the product <a href="${product.productURL}" target="_blank" rel="noopener noreferrer">here</a> now.</p>
        </div>
      `;
      break;

    case Notification.THRESHOLD_MET:
      subject = `Discount Alert for ${newTitle}`;
      body = `
        <div>
          <h4>Hey, ${product.title} is now available at a discount more than ${THRESHOLD_PERCENTAGE}%!</h4>
          <p>Grab it right away from <a href="${product.productURL}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `;
      break;

    default:
      throw new Error("Invalid notification type.");
  }

  return { subject, body };
};

const transporter = nodemailer.createTransport({
  pool: true,
  service: "hotmail",
  port: 2525,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  maxConnections: 1,
});
export const sendEmail = async (email: EmailContent, sendTo: string[]) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: sendTo,
    html: email.body,
    subject: email.subject,
  };
  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      return console.log(error);
    }
    console.log("Email sent:", info);
  });
};
