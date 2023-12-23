import { EmbedBuilder, WebhookClient } from "discord.js";
import config from "../../config/config.json" assert { type: "json" };

const characterBot = new WebhookClient({ url: config.webhookURL });
const errorBot = new WebhookClient({ url: config.webhookError });

export function sendStartSorcerer() {
  const errorEmbed = new EmbedBuilder()
    .setTitle("Iniciando as buscas por personagens.")
    .setColor(0x95b634);

  characterBot.send({
    username: "Sorcerer",
    avatarURL:
      "https://img.eservice-hk.net/upload/2022/02/27/070953_19a643fac03dd95b8223a997e1413863.png",

    embeds: [errorEmbed],
  });
}

export function sendCharacter(charInfos, tradableItems) {
  const characterEmbeb = new EmbedBuilder()
    .setTitle("Encontrei um personagem dentro dos críterios.")
    .setColor(0xff0000).setDescription(`
    **Nome:** ${charInfos.name}
    **Nível:** ${charInfos.level}
    **Força:** ${charInfos.power}
    **Preço:** ${charInfos.price}

    **Principais Itens:**
    ${tradableItems
      .map((item) => {
        return `
      **${item.itemName}:**
      Tier: ${item.itemTier}
      Enhance: ${item.itemEnhance}
      Categoria: ${item.itemGrade}
      `;
      })
      .join("")}

    **URL:** https://www.xdraco.com/nft/trade/${charInfos.id}
  `);

  characterBot.send({
    username: "Sorcerer",
    avatarURL:
      "https://img.eservice-hk.net/upload/2022/02/27/070953_19a643fac03dd95b8223a997e1413863.png",

    embeds: [characterEmbeb],
  });
}

export function sendError(error) {
  const errorEmbed = new EmbedBuilder()
    .setTitle("Oops! Ocorreu um erro em alguma solicitação.")
    .setColor(0xff0000)
    .setDescription(error);

  errorBot.send({
    username: "Sorcerer",
    avatarURL:
      "https://img.eservice-hk.net/upload/2022/02/27/070953_19a643fac03dd95b8223a997e1413863.png",

    embeds: [errorEmbed],
  });
}
