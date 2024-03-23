const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client();

const sessions = new Map();

const doctors = ["Dr. Smith", "Dr. Johnson", "Dr. Williams"];

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  qrcode.generate(qr, { small: true });
  console.log("QR RECEIVED", qr);
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  const userSession = sessions.get(msg.from) || {};
  //   if (message.body === "Ping") {
  //     await client.sendMessage(message.from, "Pong");
  //   }
  // Check if the user is in a booking session
  if (userSession.bookingStep) {
    switch (userSession.bookingStep) {
      case "selectDoctor":
        // Process the selected doctor
        if (doctors.includes(msg.body)) {
          userSession.selectedDoctor = msg.body;
          userSession.bookingStep = "selectDate";
          await client.sendMessage(
            msg.from,
            "Please select a date for the appointment (e.g., YYYY-MM-DD):"
          );
        } else {
          await client.sendMessage(
            msg.from,
            "Please select a valid doctor from the list."
          );
        }
        break;
      case "selectDate":
        // Process the selected date
        userSession.selectedDate = msg.body;
        userSession.bookingStep = "selectTimeSlot";
        await client.sendMessage(
          msg.from,
          "Please select a time slot for the appointment:"
        );
        break;
      case "selectTimeSlot":
        // Process the selected time slot
        userSession.selectedTimeSlot = msg.body;
        userSession.bookingStep = null;
        await client.sendMessage(
          msg.from,
          `Appointment booked!\nDoctor: ${userSession.selectedDoctor}\nDate: ${userSession.selectedDate}\nTime: ${userSession.selectedTimeSlot}`
        );
        // Clear session
        sessions.delete(msg.from);
        break;
    }
    sessions.set(msg.from, userSession);
  } else {
    // Not in a booking session, check for start of a new session
    if (msg.body.toLowerCase() === "/bookappointment") {
      // Start a new booking session
      await client.sendMessage(
        msg.from,
        "Please select a doctor for the appointment:\n" + doctors.join("\n")
      );
      userSession.bookingStep = "selectDoctor";
      sessions.set(msg.from, userSession);
    }
  }

  console.log(msg.body);
});

client.initialize();
