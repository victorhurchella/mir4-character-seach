import { getCharacterInfo } from "./services/getCharacter/index.js";
import { getCharactersList } from "./services/getList/index.js";
import config from "./config/config.json" assert { type: "json" };
import {
  sendCharacter,
  sendStartSorcerer,
} from "./utils/discordWebhook/index.js";

let requestPage = 1;
let duplicateCharacters = [];

function countItems(charItems) {
  let tradableItems = [];

  let itemsTier = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  };

  const charItemsLength = Object.keys(charItems).length;
  for (let item = 1; item < charItemsLength; item += 1) {
    // Verificar se é um item trocavel
    if (charItems[item]) {
      if (charItems[item].itemIdx.substr(3, 1) === "1") {
        // Verificar se é um item vermelho
        if (charItems[item].grade >= 4) {
          tradableItems.push({
            itemGrade: charItems[item].grade,
            itemName: charItems[item].itemName,
            itemTier: charItems[item].tier,
            itemEnhance: charItems[item].enhance,
          });
          const itemTier = charItems[item].tier;
          itemsTier[itemTier] = itemsTier[itemTier] += 1;
        }
      }
    }
  }
  return { tradableItems, itemsTier };
}

function verifyChar(tradableItems, itemsTier, charInfos) {
  if (tradableItems.length > 0) {
    if (itemsTier[3] > 0) {
      sendCharacter(charInfos, tradableItems);
      return;
    }
    if (itemsTier[2] > 0 && tradableItems.length >= 2) {
      sendCharacter(charInfos, tradableItems);
      return;
    }
  }
}

async function searchChars() {
  const charactersList = await getCharactersList(requestPage);

  const charactersListLength = charactersList.data.lists.length;
  for (let char = 0; char < charactersListLength; char++) {
    const charId = charactersList.data.lists[char].seq;
    if (duplicateCharacters.includes(charId)) continue; // quebra o laço se for um personagem já verificado

    const charInfo = await getCharacterInfo(charId);

    const charInfos = {
      id: charId,
      name: charInfo.data.character.name,
      level: charInfo.data.character.level,
      power: charInfo.data.character.powerScore,
      price: charInfo.data.price,
    };

    const charItems = charInfo.data.equipItem;

    const { tradableItems, itemsTier } = countItems(charItems);

    verifyChar(tradableItems, itemsTier, charInfos);
    duplicateCharacters.push(charInfos.id);
  }

  // Calculo para próxima página
  requestPage += 1;

  if (requestPage > config.maxPageNumberRequest || charactersListLength < 20) {
    requestPage = 1;
  }

  searchChars();
}

sendStartSorcerer();
searchChars();
