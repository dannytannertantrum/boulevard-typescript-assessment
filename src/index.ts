class Item {
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

  constructor() {
    this.items = [
      new Item('+5 Dexterity Vest', 10, 20),
      new Item('Aged Brie', 2, 0),
      new Item('Elixir of the Mongoose', 5, 7),
      new Item('Sulfuras, Hand of Ragnaros', 0, 80),
      new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20),
      new Item('Conjured Mana Cake', 3, 6),
    ];
  }

  updateQuality(): this {
    for (const item of this.items) {
      if (
        item.name != 'Aged Brie' &&
        item.name != 'Backstage passes to a TAFKAL80ETC concert'
      ) {
        if (item.quality > 0) {
          if (item.name != 'Sulfuras, Hand of Ragnaros') {
            item.quality = item.quality - 1;
          }
        }
      } else {
        if (item.quality < 50) {
          item.quality = item.quality + 1;
          if (item.name == 'Backstage passes to a TAFKAL80ETC concert') {
            if (item.sellIn < 11) {
              if (item.quality < 50) {
                item.quality = item.quality + 1;
              }
            }
            if (item.sellIn < 6) {
              if (item.quality < 50) {
                item.quality = item.quality + 1;
              }
            }
          }
        }
      }
      if (item.name != 'Sulfuras, Hand of Ragnaros') {
        item.sellIn = item.sellIn - 1;
      }
      if (item.sellIn < 0) {
        if (item.name != 'Aged Brie') {
          if (item.name != 'Backstage passes to a TAFKAL80ETC concert') {
            if (item.quality > 0) {
              if (item.name != 'Sulfuras, Hand of Ragnaros') {
                item.quality = item.quality - 1;
              }
            }
          } else {
            item.quality = item.quality - item.quality;
          }
        } else {
          if (item.quality < 50) {
            item.quality = item.quality + 1;
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
