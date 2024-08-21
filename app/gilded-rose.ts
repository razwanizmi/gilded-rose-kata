export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name: string, sellIn: number, quality: number) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  static NormalDegrade = 1;
  static PastSellInDegrade = 2;

  static BackstagePassHighDemand = 3;
  static BackstagePassMediumDemand = 2;
  static BackstagePassLowDemand = 1;

  /** Keeps Quality at 0 or 50 */
  handleQuality(quality: number) {
    return Math.max(0, Math.min(50, quality));
  }

  /** Updates SellIn day */
  updateSellInDay(day: number) {
    return day - 1;
  }

  /** Regular Items quality value decreases each day, and degrades twice as fast once sellIn date has passed */
  handleRegularItem(item: Item) {
    const degrade =
      item.sellIn <= 0
        ? GildedRose.PastSellInDegrade
        : GildedRose.NormalDegrade;

    item.sellIn = this.updateSellInDay(item.sellIn);
    item.quality = this.handleQuality(item.quality - degrade);
    return item;
  }

  /**
   * Backstage passes increases in quality each day by 1 normally
   * Quality increases by 2 <= 10 days
   * Quality increases by 3 <= 5 days
   * Quality drops to 0 when sellin day is 0
   */
  handleBackstagePasses(passes: Item) {
    let newPassesQuality = passes.quality;

    if (passes.sellIn > 0) {
      if (passes.sellIn <= 5) {
        newPassesQuality += GildedRose.BackstagePassHighDemand;
      } else if (passes.sellIn <= 10) {
        newPassesQuality += GildedRose.BackstagePassMediumDemand;
      } else {
        newPassesQuality += GildedRose.BackstagePassLowDemand;
      }
      newPassesQuality = this.handleQuality(newPassesQuality);
    } else {
      newPassesQuality = 0;
    }

    passes.sellIn = this.updateSellInDay(passes.sellIn);
    passes.quality = newPassesQuality;
    return passes;
  }

  /** Aged Brie increases in quality the older it gets */
  handleAgedBrie(brie: Item) {
    const increase =
      brie.sellIn <= 0
        ? GildedRose.PastSellInDegrade
        : GildedRose.NormalDegrade;

    brie.sellIn = this.updateSellInDay(brie.sellIn);
    brie.quality = this.handleQuality(brie.quality + increase);
    return brie;
  }

  /** Sulfuras is never sold or decreases in quality */
  handleSulfuras(sulfuras: Item) {
    return sulfuras;
  }

  /** Conjured items degrade twice as fast */
  handleConjured(conjured: Item) {
    const degrade =
      conjured.sellIn <= 0
        ? GildedRose.PastSellInDegrade * 2
        : GildedRose.NormalDegrade * 2;

    conjured.sellIn = this.updateSellInDay(conjured.sellIn);
    conjured.quality = this.handleQuality(conjured.quality - degrade);
    return conjured;
  }

  updateQuality() {
    return this.items.map((item) => {
      switch (item.name) {
        case "Aged Brie":
          return this.handleAgedBrie(item);
        case "Conjured Mana Cake":
          return this.handleConjured(item);
        case "Backstage passes to a TAFKAL80ETC concert":
          return this.handleBackstagePasses(item);
        case "Sulfuras, Hand of Ragnaros":
          return this.handleSulfuras(item);
        default:
          return this.handleRegularItem(item);
      }
    });
  }
}
