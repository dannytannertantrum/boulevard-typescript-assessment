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

/* at EOD, the system lowers the value of an item
  - sellIn < 0 quality degrades twice as fast
  - quality is never negative
  - "Aged Brie" increases quality with time
  - quality is never more than 50
  - "Sulfuras" never has to be sold nor does quality decrease
    - always quality of 80 and never changes
  - "Backstage passes" increase quality when sellIn decreases
    - also increases by 2 when there are 10 days or less
    - increases by 3 when there are 5 days or less
    - but quality drops to zero after the concert
  
  UPDATES:
    - "Conjured" items quality decrease twice as fast
    - don't touch Item class or items property
    - preserve legacy behavior
  
  High level steps:
    - Add tests to ensure legacy behavior actually WORKS before refactoring - DONE
    - Do incremental refactors and ensure tests pass each step of the way
      - Add any new tests as needed
    - Implement "Conjured" items
*/

export default class GildedRose {
  items: Item[];

  // CONSTANTS
  DEXTERITY_VEST = '+5 Dexterity Vest';
  AGED_BRIE = 'Aged Brie';
  ELIXIR = 'Elixir of the Mongoose';
  SULFURAS = 'Sulfuras, Hand of Ragnaros';
  SULFURAS_QUALITY = 80; // Quality and sellIn should never change here, so make them constants
  SULFURAS_SELL_IN = 0;
  BACKSTAGE_PASSES = 'Backstage passes to a TAFKAL80ETC concert';
  CONJURED = 'Conjured Mana Cake';

  constructor() {
    this.items = [
      new Item(this.DEXTERITY_VEST, 10, 20),
      new Item(this.AGED_BRIE, 2, 0),
      new Item(this.ELIXIR, 5, 7),
      new Item(this.SULFURAS, this.SULFURAS_SELL_IN, this.SULFURAS_QUALITY),
      new Item(this.BACKSTAGE_PASSES, 15, 20),
      new Item(this.CONJURED, 3, 6),
    ];
  }

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

  updateQuality(): this {
    for (const item of this.items) {
      if (item.name === this.BACKSTAGE_PASSES) {
        this.updateBackstagePasses(item);
      }
      if (item.name !== this.BACKSTAGE_PASSES && item.name !== this.SULFURAS) {
        if (item.name != 'Aged Brie') {
          if (item.quality > 0) {
            item.quality = item.quality - 1;
          }
        } else {
          if (item.quality < 50) {
            item.quality = item.quality + 1;
          }
        }
        item.sellIn = item.sellIn - 1;
        if (item.sellIn < 0) {
          if (item.name != 'Aged Brie') {
            if (item.quality > 0) {
              item.quality = item.quality - 1;
            }
          } else {
            if (item.quality < 50) {
              item.quality = item.quality + 1;
            }
          }
        }
      }
    }
    return this;
  }

  // Original untouched for reference, but delete after complete refactor
  // updateQuality(): this {
  //   for (var i = 0; i < this.items.length; i++) {
  //     if (
  //       this.items[i].name != 'Aged Brie' &&
  //       this.items[i].name != 'Backstage passes to a TAFKAL80ETC concert'
  //     ) {
  //       if (this.items[i].quality > 0) {
  //         if (this.items[i].name != 'Sulfuras, Hand of Ragnaros') {
  //           this.items[i].quality = this.items[i].quality - 1;
  //         }
  //       }
  //     } else {
  //       if (this.items[i].quality < 50) {
  //         this.items[i].quality = this.items[i].quality + 1;
  //         if (
  //           this.items[i].name == 'Backstage passes to a TAFKAL80ETC concert'
  //         ) {
  //           if (this.items[i].sellIn < 11) {
  //             if (this.items[i].quality < 50) {
  //               this.items[i].quality = this.items[i].quality + 1;
  //             }
  //           }
  //           if (this.items[i].sellIn < 6) {
  //             if (this.items[i].quality < 50) {
  //               this.items[i].quality = this.items[i].quality + 1;
  //             }
  //           }
  //         }
  //       }
  //     }
  //     if (this.items[i].name != 'Sulfuras, Hand of Ragnaros') {
  //       this.items[i].sellIn = this.items[i].sellIn - 1;
  //     }
  //     if (this.items[i].sellIn < 0) {
  //       if (this.items[i].name != 'Aged Brie') {
  //         if (
  //           this.items[i].name != 'Backstage passes to a TAFKAL80ETC concert'
  //         ) {
  //           if (this.items[i].quality > 0) {
  //             if (this.items[i].name != 'Sulfuras, Hand of Ragnaros') {
  //               this.items[i].quality = this.items[i].quality - 1;
  //             }
  //           }
  //         } else {
  //           this.items[i].quality =
  //             this.items[i].quality - this.items[i].quality;
  //         }
  //       } else {
  //         if (this.items[i].quality < 50) {
  //           this.items[i].quality = this.items[i].quality + 1;
  //         }
  //       }
  //     }
  //   }
  //   return this;
  // }
}
