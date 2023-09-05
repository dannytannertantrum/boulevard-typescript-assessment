export class Item {
  name: string;
  sellIn: number; // number of days to sell an item
  quality: number; // number denoting how valuable an item is

  constructor(name: string, sellIn: number, quality: number) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export default class GildedRose {
  // OTHER UPDATES
  // - can we MOVE items? If so, move it into the constructor using shorthand syntax
  //  - allowing greater flexibility in creating new instances
  // - move everything into one beforeEach in the tests
  // - use array destructuring and name things as opposed to doing item numbers

  // CONSTANTS
  DEXTERITY_VEST = '+5 Dexterity Vest';
  AGED_BRIE = 'Aged Brie';
  ELIXIR = 'Elixir of the Mongoose';
  SULFURAS = 'Sulfuras, Hand of Ragnaros';
  SULFURAS_QUALITY = 80; // Quality and sellIn should never change here, so make them constants
  SULFURAS_SELL_IN = 0;
  BACKSTAGE_PASSES = 'Backstage passes to a TAFKAL80ETC concert';
  CONJURED = 'Conjured Mana Cake';

  constructor(public items: Item[]) {}

  /**
   * - increase quality for Backstage passes when sellIn decreases
   * - increase Backstage value by 2 when there are 10 days or less
   * - increase Backstage value by 3 when there are 5 days or less
   * - drops Backstage quality to zero after the concert
   */
  public updateBackstagePasses(item: Item): void {
    item.sellIn--;
    if (item.sellIn < 0) {
      item.quality = 0;
    } else if (item.sellIn < 5) {
      item.quality += 3;
    } else if (item.sellIn < 10) {
      item.quality += 2;
    } else {
      item.quality++;
    }
  }

  /**
   * - decrease quality value of an item each day
   * - decrease quality value twice as fast if sellIn < 0
   */
  public updateStandardItem(item: Item): void {
    item.sellIn--;
    item.quality--;
    if (item.sellIn < 0) {
      item.quality--;
    }
  }

  /**
   * - increase Aged Brie quality over time
   */
  public updateAgedBrie(item: Item): void {
    item.sellIn--;
    item.quality++;
  }

  /**
   * - Conjured items degrade in quality value twice as fast
   */
  public updateConjuredItem(item: Item): void {
    item.sellIn--;
    item.quality -= 2;
    if (item.sellIn < 0) {
      item.quality -= 2;
    }
  }

  updateQuality(): this {
    for (const item of this.items) {
      switch (item.name) {
        case this.AGED_BRIE:
          this.updateAgedBrie(item);
          break;
        case this.BACKSTAGE_PASSES:
          this.updateBackstagePasses(item);
          break;
        case this.SULFURAS:
          // Sulfuras does not change
          break;
        case this.CONJURED:
          this.updateConjuredItem(item);
          break;
        default:
          this.updateStandardItem(item);
          break;
      }

      // Ensure quality is between 0 and 50
      if (item.name !== this.SULFURAS) {
        item.quality = Math.max(0, Math.min(50, item.quality));
      }
    }
    return this;
  }
}
