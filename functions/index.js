// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

exports.notifyOnNewMessage = functions.firestore
  .document("messages/{messageId}")
  .onCreate(async (snap, context) => {
    const message = snap.data();
    if (!message) return null;

    const { senderId, receiverId, text } = message;

    try {
      // fetch receiver token and sender info
      const receiverDoc = await db.collection("users").doc(receiverId).get();
      const senderDoc = await db.collection("users").doc(senderId).get();

      if (!receiverDoc.exists) {
        console.log("Receiver not found in Firestore");
        return null;
      }

      const receiverData = receiverDoc.data();
      const token = receiverData?.fcmToken;

      if (!token) {
        console.log("Receiver has no FCM token, skipping push");
        return null;
      }

      const senderName =
        senderDoc.exists && senderDoc.data().displayName
          ? senderDoc.data().displayName
          : "Someone";

      const payload = {
        notification: {
          title: ${senderName},
          body:
            text && text.length > 100
              ? text.slice(0, 97) + "..."
              : text || "New message",
        },
        data: {
          senderId: senderId || "",
          receiverId: receiverId || "",
          click_action: "FLUTTER_NOTIFICATION_CLICK", // standard FCM click action
        },
      };

      const response = await admin.messaging().sendToDevice(token, payload);
      console.log("Sent notification:", response);
      return null;
    } catch (err) {
      console.error("Error sending push:", err);
      return null;
    }
  });