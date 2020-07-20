import { firebaseapp } from "./firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseapp);

export const acceptOrder = (orderId, token, setLoadingOrder, setCheck) => {
  setLoadingOrder(true);
  db.collection("orders")
    .doc(orderId)
    .update({ received: true })
    .then(() => {
      sendPushNotification(token, "Orden Recibida");
      setLoadingOrder(false);
      setCheck(true);
    });
};

export const deniedOrder = (orderId, token, setLoadingOrder, setCheck) => {
  setLoadingOrder(true);
  db.collection("orders")
    .doc(orderId)
    .update({ cancelled: true })
    .then(() => {
      sendPushNotification(token, "No Disponible");
      setLoadingOrder(false);
      setCheck(true);
    });
};

export const sendOrder = (orderId, token, setLoadingOrder, setCheck) => {
  setLoadingOrder(true);
  db.collection("orders")
    .doc(orderId)
    .update({ sended: true })
    .then(() => {
      sendPushNotification(token, "Orden Enviada");
      setLoadingOrder(false);
      setCheck(true);
    });
};

export const getLocation = () => {};

export const deliveredOrder = (orderId, token, setLoadingOrder, setCheck) => {
  setLoadingOrder(true);
  db.collection("orders")
    .doc(orderId)
    .update({ delivered: true, deliveredHour: new Date() })
    .then(() => {
      sendPushNotification(token, "Orden entregada");
      setLoadingOrder(false);
      setCheck(true);
    });
};

// sendPushNotification = async (token, text) => {
//   let response = await fetch("https://exp.host/--/api/v2/push/send", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       to: token,
//       sound: "default",
//       title: "oslu food",
//       body: text,
//     }),
//   });
// };

export async function sendPushNotification(token, text) {
  const message = {
    to: token,
    sound: "default",
    title: "Oslu Food",
    body: text || "testing text",
    data: { data: "goes here" },
  };
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
