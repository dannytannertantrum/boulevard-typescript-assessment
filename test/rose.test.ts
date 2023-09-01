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
  describe('updateQuality Method', () => {
    describe('Regular updates by item', () => {
      let gildedRose: GildedRose;
      beforeEach(() => {
        gildedRose = new GildedRose();
        gildedRose.updateQuality();
      });

      it('should decrease quality for standard items by 1', () => {
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

      it('should decrease quality by 2 each day for Conjured items', () => {
        expect(gildedRose.items[5].quality).toBe(4);
      });
    });

    describe('Edge case updates', () => {
      it('should decrease quality twice as fast for all items except Aged Brie and backstage passes when sellIn < 0', () => {
        const gildedRose = new GildedRose();
        gildedRose.items.forEach(item => (item.sellIn = 0));

        gildedRose.updateQuality();

        expect(gildedRose.items[0].quality).toBe(18);
        // Not completely sure if Brie should reverse and DOUBLE when sellIn < 0,
        // so kept it increasing in value at the same pace because it seems likely it's a different behavior entirely
        expect(gildedRose.items[1].quality).toBe(1);
        expect(gildedRose.items[2].quality).toBe(5);
        expect(gildedRose.items[3].quality).toBe(80);
        expect(gildedRose.items[4].quality).toBe(0);
        // Assuming if Conjured items decrease in value twice as fast,
        // then it should double when sellIn < 0 and drop in value by 4
        // Maybe the goblin in the corner can help clarify these thigns?
        expect(gildedRose.items[5].quality).toBe(2);
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
  });

  describe('Update Methods', () => {
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

    describe('updateStandardItem', () => {
      const gildedRose = new GildedRose();
      let standardItem: Item;

      it('should decrease quality for regular items by 1', () => {
        standardItem = new Item('Vest', 10, 10);

        gildedRose.updateStandardItem(standardItem);

        expect(standardItem.quality).toBe(9);
      });

      it('should decrease item quality twice as fast when sellIn < 0', () => {
        standardItem = new Item('Vest', 0, 10);

        gildedRose.updateStandardItem(standardItem);

        expect(standardItem.quality).toBe(8);
      });
    });

    describe('updateAgedBrie', () => {
      const gildedRose = new GildedRose();
      let agedBrieItem: Item;

      it('should increase quality for Aged Brie by 1', () => {
        agedBrieItem = new Item('CHEEEESE!!!', 10, 10);

        gildedRose.updateAgedBrie(agedBrieItem);

        expect(agedBrieItem.quality).toBe(11);
      });
    });

    describe('updateConjuredItem', () => {
      const gildedRose = new GildedRose();
      let conjuredItem: Item;

      it('should decrease quality value by 2 each day', () => {
        conjuredItem = new Item('Valek', 10, 10);

        gildedRose.updateConjuredItem(conjuredItem);

        expect(conjuredItem.quality).toBe(8);
      });
    });
  });
});
