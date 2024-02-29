// import { PublisherChannel } from "./PublisherChannel.js";
import fetch from "node-fetch";
export function sendRequest(url, method = "GET", body = "", headers = {}) {
    const content = {
      method: method,
      headers: headers,
    };
    if (body) {
      content["body"] = body;
    }
    return fetch(url, content);
  }

  export const announceNewOrder = async (publisherChannel, order) => {
    const message = {
      username: order.customerId,
      products: order.products,
      quantities: order.quantities,
    };
    publisherChannel.sendEvent(JSON.stringify(message));
  };
