export interface CardSet {
  set_name: string;
  set_code: string;
  set_rarity: string;
  set_rarity_code?: string;
  set_price: string;
}

export interface CardImage {
  id: number;
  image_url: string;
  image_url_small: string;
  image_url_cropped?: string;
}

// atk, def, level, attribute, archetype, card_sets y card_images son opcionales:
// las cartas mágicas/trampa no tienen atributo, nivel, ATK ni DEF.
export interface YugiohCard {
  id: number;
  name: string;
  type: string;
  desc: string;
  race?: string;
  atk?: number;
  def?: number;
  level?: number;
  attribute?: string;
  archetype?: string;
  card_sets?: CardSet[];
  card_images?: CardImage[];
}

export interface YgoApiResponse {
  data: YugiohCard[];
}
