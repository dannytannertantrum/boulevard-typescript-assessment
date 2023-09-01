import GildedRose, { Item } from '../src';

/*
this.items.push(new Item('+5 Dexterity Vest', 10, 20));
this.items.push(new Item('Aged Brie', 2, 0));
this.items.push(new Item('Elixir of the Mongoose', 5, 7));
this.items.push(new Item('Sulfuras, Hand of Ragnaros', 0, 80));
this.items.push(
  new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20)
);
this.items.push(new Item('Conjured Mana Cake', 3, 6));
*/

describe('GildedRose', () => {
  describe('Standard item updates', () => {
    let gildedRose: GildedRose;
    beforeEach(() => {
      gildedRose = new GildedRose();
      gildedRose.updateQuality();
    });

    it('should decrease quality for regular items by 1', () => {
      expect(gildedRose.items[0].quality).toBe(19);
      expect(gildedRose.items[0].sellIn).toBe(9);
      expect(gildedRose.items[2].quality).toBe(6);
      expect(gildedRose.items[2].sellIn).toBe(4);
    });

    it('should increase quality for Aged Brie', () => {
      expect(gildedRose.items[1].quality).toBe(1);
      expect(gildedRose.items[1].sellIn).toBe(1);
    });

    it('should keep quality the same for Sulfuras', () => {
      expect(gildedRose.items[3].quality).toBe(80);
      expect(gildedRose.items[3].sellIn).toBe(0);
    });

    it('should increase quality for Backstage passes when sellIn decreases', () => {
      expect(gildedRose.items[4].quality).toBe(21);
      expect(gildedRose.items[4].sellIn).toBe(14);
    });
  });

  describe('Edge case updates', () => {
    it('should decrease quality twice as fast when sellIn < 0', () => {
      const gildedRose = new GildedRose();
      gildedRose.items[0].sellIn = 0;

      gildedRose.updateQuality();

      expect(gildedRose.items[0].quality).toBe(18);
    });
  });

  describe('Other behaviors and constants', () => {
    let gildedRose: GildedRose;
    beforeEach(() => {
      gildedRose = new GildedRose();
    });

    it('should never have a negative quality value', () => {
      gildedRose.items[0].quality = 0;
      gildedRose.updateQuality();

      expect(gildedRose.items[0].quality).toBe(0);
    });

    it('should never have a quality value greater than 50', () => {
      gildedRose.items[1].quality = 50;
      gildedRose.updateQuality();

      expect(gildedRose.items[1].quality).toBe(50);
    });

    it('increases Backstage value by 2 when there are 10 days or less', () => {
      gildedRose.items[4].sellIn = 10;
      gildedRose.updateQuality();

      expect(gildedRose.items[4].quality).toBe(22);
    });
    it('increases Backstage value by 3 when there are 5 days or less', () => {
      gildedRose.items[4].sellIn = 5;
      gildedRose.updateQuality();

      expect(gildedRose.items[4].quality).toBe(23);
    });
    it('drops Backstage quality to zero after the concert', () => {
      gildedRose.items[4].sellIn = 0;
      gildedRose.updateQuality();

      expect(gildedRose.items[4].quality).toBe(0);
    });
  });

  describe('updateBackstagePasses', () => {
    const gildedRose = new GildedRose();
    let backstageConcertItem: Item;

    it('increases an item quality value by 2 when there are 10 days or less', () => {
      backstageConcertItem = new Item('Concert', 10, 10);

      gildedRose.updateBackstagePasses(backstageConcertItem);

      expect(backstageConcertItem.quality).toBe(12);
    });

    it('increases Backstage value by 3 when there are 5 days or less', () => {
      backstageConcertItem = new Item('Concert', 5, 10);

      gildedRose.updateBackstagePasses(backstageConcertItem);

      expect(backstageConcertItem.quality).toBe(13);
    });
    it('drops Backstage quality to zero after the concert', () => {
      backstageConcertItem = new Item('Concert', 0, 10);

      gildedRose.updateBackstagePasses(backstageConcertItem);

      expect(backstageConcertItem.quality).toBe(0);
    });
  });
});
