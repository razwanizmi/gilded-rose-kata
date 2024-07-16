import { Item, GildedRose } from "@/gilded-rose";

describe("Gilded Rose", () => {
  it("should decrease the quality and sellIn for normal items", () => {
    const gildedRose = new GildedRose([new Item("Normal Item", 10, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0].sellIn).toBe(9);
    expect(items[0].quality).toBe(19);
  });

  it("should not decrease the quality below 0", () => {
    const gildedRose = new GildedRose([new Item("Normal Item", 10, 0)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
  });

  it("should increase the quality of Aged Brie", () => {
    const gildedRose = new GildedRose([new Item("Aged Brie", 10, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(21);
    expect(items[0].sellIn).toBe(9);
  });

  it("should not increase the quality of Aged Brie above 50", () => {
    const gildedRose = new GildedRose([new Item("Aged Brie", 10, 50)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(50);
  });

  it("should not decrease the sellIn or quality of Sulfuras", () => {
    const gildedRose = new GildedRose([
      new Item("Sulfuras, Hand of Ragnaros", 10, 80),
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].sellIn).toBe(10);
    expect(items[0].quality).toBe(80);
  });

  it("should increase the quality of Backstage passes", () => {
    const gildedRose = new GildedRose([
      new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(21);
    expect(items[0].sellIn).toBe(14);
  });

  it("should increase the quality of Backstage passes by 2 when there are 10 days or less", () => {
    const gildedRose = new GildedRose([
      new Item("Backstage passes to a TAFKAL80ETC concert", 10, 20),
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(22);
    expect(items[0].sellIn).toBe(9);
  });

  it("should increase the quality of Backstage passes by 3 when there are 5 days or less", () => {
    const gildedRose = new GildedRose([
      new Item("Backstage passes to a TAFKAL80ETC concert", 5, 20),
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(23);
    expect(items[0].sellIn).toBe(4);
  });

  it("should drop the quality of Backstage passes to 0 after the concert", () => {
    const gildedRose = new GildedRose([
      new Item("Backstage passes to a TAFKAL80ETC concert", 0, 20),
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
    expect(items[0].sellIn).toBe(-1);
  });

  it("should decrease the quality twice as fast after the sell-by date", () => {
    const gildedRose = new GildedRose([new Item("Normal Item", 0, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(8);
    expect(items[0].sellIn).toBe(-1);
  });

  it("should increase the quality of Aged Brie by 2 after the sell-by date", () => {
    const gildedRose = new GildedRose([new Item("Aged Brie", 0, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(22);
    expect(items[0].sellIn).toBe(-1);
  });

  it("should handle multiple items correctly", () => {
    const items = [
      new Item("Normal Item", 5, 10),
      new Item("Aged Brie", 3, 10),
      new Item("Sulfuras, Hand of Ragnaros", 0, 80),
      new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),
    ];
    const gildedRose = new GildedRose(items);
    const updatedItems = gildedRose.updateQuality();

    expect(updatedItems[0].sellIn).toBe(4);
    expect(updatedItems[0].quality).toBe(9);

    expect(updatedItems[1].sellIn).toBe(2);
    expect(updatedItems[1].quality).toBe(11);

    expect(updatedItems[2].sellIn).toBe(0);
    expect(updatedItems[2].quality).toBe(80);

    expect(updatedItems[3].sellIn).toBe(14);
    expect(updatedItems[3].quality).toBe(21);
  });
});
