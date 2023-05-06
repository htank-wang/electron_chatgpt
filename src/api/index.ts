import axios from "axios";
const db = require("@electron/remote").getGlobal("db");

export const postRemoteMessage = async (messages: any) => {
  return await axios({
    method: "post",
    url: "https://api.openai.com/v1/chat/completions",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${db.get("config").key}`,
    },
    data: {
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
    },
  });
};
