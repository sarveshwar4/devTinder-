const { SendEmailCommand } = require('@aws-sdk/client-ses');
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "Hello World from SES",
      },
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: "This is my first text message.",
        },
        Html: {
          Charset: "UTF-8",
          Data: "<h1>hello ji this is my body portion</h1>",
        },
      },
    },
    Source: fromAddress,
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "sarveshwar2213101@akgec.ac.in",
    "sarveshwarkumarshukla@gmail.com"
  );

  try {
    const result = await sesClient.send(sendEmailCommand);
    console.log("Email sent:", result);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    return error;
  }
};

module.exports = { run };
