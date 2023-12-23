import axios from "axios";
import { sendError } from "../../utils/discordWebhook/index.js";

export async function getCharacterInfo(id) {
  const options = {
    method: "GET",
    url: "https://webapi.mir4global.com/nft/character/summary",
    params: {
      seq: id,
      languageCode: "pt",
    },
  };

  return await axios
    .request(options)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      sendError(err);
    });
}
