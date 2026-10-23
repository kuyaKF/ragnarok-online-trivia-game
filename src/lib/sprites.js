// Sprites live in public/sprites (monsters) and public/items (item icons)
export const monsterSpriteUrl = (id) => `/sprites/${id}.gif`

// All cards share one generic icon
export const itemSpriteUrl = (item) =>
  item.item_name.endsWith(' Card')
    ? '/items/card.gif'
    : `/items/${item.item_id}.gif`
