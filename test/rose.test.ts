import GildedRose, { Item } from '../src';

describe('GildedRose', () => {
  let gildedRose: GildedRose;
  let vest: Item,
    brie: Item,
    elixir: Item,
    sulfuras: Item,
    concert: Item,
    conjured: Item;

  beforeEach(() => {
    const items: Item[] = [
      new Item('+5 Dexterity Vest', 10, 20),
      new Item('Aged Brie', 2, 0),
      new Item('Elixir of the Mongoose', 5, 7),
      new Item('Sulfuras, Hand of Ragnaros', 0, 80),
      new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20),
      new Item('Conjured Mana Cake', 3, 6),
    ];

    [vest, brie, elixir, sulfuras, concert, conjured] = items;

    gildedRose = new GildedRose(items);
  });

  describe('updateQuality Method', () => {
    describe('Regular updates by item', () => {
      beforeEach(() => {
        gildedRose.updateQuality();
      });

      it('should decrease quality for standard items by 1', () => {
        expect(vest.quality).toBe(19);
        expect(vest.sellIn).toBe(9);
        expect(elixir.quality).toBe(6);
        expect(elixir.sellIn).toBe(4);
      });

      it('should increase quality for Aged Brie', () => {
        expect(brie.quality).toBe(1);
        expect(brie.sellIn).toBe(1);
      });

      it('should keep quality the same for Sulfuras', () => {
        expect(sulfuras.quality).toBe(80);
        expect(sulfuras.sellIn).toBe(0);
      });

      it('should increase quality for Backstage passes when sellIn decreases', () => {
        expect(concert.quality).toBe(21);
        expect(concert.sellIn).toBe(14);
      });

      it('should decrease quality by 2 each day for Conjured items', () => {
        expect(conjured.quality).toBe(4);
      });
    });

    describe('Edge case updates', () => {
      it('should decrease quality twice as fast for all items except Aged Brie and backstage passes when sellIn < 0', () => {
        gildedRose.items.forEach(item => (item.sellIn = 0));

        gildedRose.updateQuality();

        expect(vest.quality).toBe(18);
        // Not completely sure if Brie should reverse and DOUBLE when sellIn < 0,
        // so kept it increasing in value at the same pace because it seems likely it's a different behavior entirely
        expect(brie.quality).toBe(1);
        expect(elixir.quality).toBe(5);
        expect(sulfuras.quality).toBe(80);
        expect(concert.quality).toBe(0);
        // Assuming if Conjured items decrease in value twice as fast,
        // then it should double when sellIn < 0 and drop in value by 4
        // Maybe the goblin in the corner can help clarify these thigns?
        expect(conjured.quality).toBe(2);
      });
    });

    describe('Other behaviors and constants', () => {
      it('should never have a negative quality value', () => {
        vest.quality = 0;
        gildedRose.updateQuality();

        expect(vest.quality).toBe(0);
      });

      it('should never have a quality value greater than 50', () => {
        brie.quality = 50;
        gildedRose.updateQuality();

        expect(brie.quality).toBe(50);
      });

      it('increases Backstage value by 2 when there are 10 days or less', () => {
        concert.sellIn = 10;
        gildedRose.updateQuality();

        expect(concert.quality).toBe(22);
      });

      it('increases Backstage value by 3 when there are 5 days or less', () => {
        concert.sellIn = 5;
        gildedRose.updateQuality();

        expect(concert.quality).toBe(23);
      });

      it('drops Backstage quality to zero after the concert', () => {
        concert.sellIn = 0;
        gildedRose.updateQuality();

        expect(concert.quality).toBe(0);
      });
    });
  });

  describe('Update Methods', () => {
    describe('updateBackstagePasses', () => {
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
      let agedBrieItem: Item;

      it('should increase quality for Aged Brie by 1', () => {
        agedBrieItem = new Item('CHEEEESE!!!', 10, 10);

        gildedRose.updateAgedBrie(agedBrieItem);

        expect(agedBrieItem.quality).toBe(11);
      });
    });

    describe('updateConjuredItem', () => {
      let conjuredItem: Item;

      it('should decrease quality value by 2 each day', () => {
        conjuredItem = new Item('Valek', 10, 10);

        gildedRose.updateConjuredItem(conjuredItem);

        expect(conjuredItem.quality).toBe(8);
      });
    });
  });
});
