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

  export const announceNewUser = async (publisherChannel, username) => {
    const message = {
      username: username,
    };
    publisherChannel.sendEvent(JSON.stringify(message));
  };
