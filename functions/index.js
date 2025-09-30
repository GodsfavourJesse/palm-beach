const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();
const fcm = admin.messaging();

/**
 * Trigger when a new message is created in Firestore
 * Adjust collection path if yours differs (e.g., /chats/{chatId}/messages/{messageId})
 */
exports.sendMessageNotification = functions.firestore
  .document("messages/{messageId}")
  .onCreate(async (snapshot, context) => {
    const messageData = snapshot.data();

    if (!messageData) return null;

    const { senderId, text, participants } = messageData;

    try {
      // Get sender info
      const senderDoc = await db.collection("users").doc(senderId).get();
      const senderName = senderDoc.exists ? senderDoc.data().displayName || "Someone" : "Someone";

      // Get recipient(s) tokens
      const tokens = [];
      for (const uid of participants || []) {
        if (uid !== senderId) {
          const userDoc = await db.collection("users").doc(uid).get();
          if (userDoc.exists && userDoc.data().fcmToken) {
            tokens.push(userDoc.data().fcmToken);
          }
        }
      }

      if (tokens.length === 0) {
        console.log("⚠ No tokens found for recipients");
        return null;
      }

      // Build notification
      const payload = {
        notification: {
          title: New message from ${senderName},
          body: text ? text.substring(0, 50) : "📩 You have a new message",
        },
        data: {
          senderId,
          click_action: "FLUTTER_NOTIFICATION_CLICK", // helps Android foreground handling
        },
      };

      // Send to all tokens
      const response = await fcm.sendToDevice(tokens, payload);
      console.log("✅ Notifications sent:", response);

      return response;
    } catch (err) {
      console.error("❌ Error sending notification:", err);
      return null;
    }
  });