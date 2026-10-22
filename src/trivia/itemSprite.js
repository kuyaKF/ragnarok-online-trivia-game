// src/trivia/itemSprite.js
export const itemSpriteUrl = (item) =>
  item.item_name.endsWith(' Card')
    ? '/items/card.gif'
    : `/items/${item.item_id}.gif`