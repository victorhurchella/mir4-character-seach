import axios from "axios";
import config from "../../config/config.json" assert { type: "json" };
import { sendError } from "../../utils/discordWebhook/index.js";

export async function getCharactersList(page) {
  const options = {
    method: "GET",
    url: "https://webapi.mir4global.com/nft/lists",
    params: {
      listType: "sale",
      class: "0",
      levMin: config.levMin,
      levMax: config.levMax,
      powerMin: config.powerMin,
      powerMax: config.powerMax,
      priceMin: config.priceMin,
      priceMax: config.priceMax,
      sort: "latest",
      page: page,
      languageCode: "pt",
    },
  };

  return await axios
    .request(options)
    .then((response) => {
      console.log(
        `[Sorcerer BOT] Iniciando busca nos personagens da página ${page}`
      );

      return response.data;
    })
    .catch((err) => {
      sendError(err);
    });
}
