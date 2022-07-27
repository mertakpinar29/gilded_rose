import { Item, GildedRose } from "@/gilded-rose";

describe("All tests", () => {
  const applyUpdateQuality = (
    numOfDays: number,
    gildedRose: GildedRose
  ): void => {
    for (let i = 0; i < numOfDays; i++) {
      gildedRose.updateQuality();
    }
  };

  let numOfDays: number;
  let input: Item[] = [];
  let gildedRose: GildedRose = new GildedRose(input);

  describe("Standart & Conjured products Quality Tests", () => {
    test.each`
      input                                                                      | expectedResult
      ${[new Item("Test Item 1", 10, 45), new Item("Test Item 2", 10, 49)]}      | ${[new Item("Test Item 1", 0, 35), new Item("Test Item 2", 0, 39)]}
      ${[new Item("Test Item 3", 5, 21), new Item("Test Item 4", -1, 14)]}       | ${[new Item("Test Item 3", -5, 6), new Item("Test Item 4", -11, 0)]}
      ${[new Item("Conjured Lamp", 5, 35), new Item("Conjured Flower", 15, 14)]} | ${[new Item("Conjured Lamp", -5, 5), new Item("Conjured Flower", 5, 0)]}
    `(
      "Standart & Conjured products quality test",
      ({ input, expectedResult }) => {
        numOfDays = 10;
        // second input will be helpful for us to find out if degrationRate is working properly on negative sellIn values.
        // thirs input will be helpful for us to find out if degrationRate is working properly on Conjured items
        applyUpdateQuality(numOfDays, new GildedRose(input));
        expect(input).toEqual(expectedResult);
      }
    );
  });

  describe("Constant value test(s)", () => {
    test("Testing Sulphure Items", () => {
      input = [
        new Item("Sulfuras, Hand of Ragnaros", 10, 80),
        new Item("Sulfuras, Hand of Ragnaros", 5, 80),
        new Item("Sulfuras, Hand of Ragnaros", -5, 80),
        new Item("Sulfuras, Hand of Ragnaros", 100, 80),
        new Item("Sulfuras, Hand of Ragnaros", 0, 80),
        new Item("Sulfuras, Hand of Ragnaros", 15, 80),
      ];

      numOfDays = Math.floor(Math.random() * 10);
      applyUpdateQuality(numOfDays, gildedRose);
      // after each day quality must remain same
      expect(input).toEqual(
        expect.arrayContaining([expect.objectContaining({ quality: 80 })])
      );
    });
  });

  describe("Dynamic value test(s)", () => {
    test("Aged Brie's Quality can not be greater than 50", () => {
      input = [new Item("Aged Brie", 10, 45), new Item("Aged Brie", 10, 49)];
      gildedRose = new GildedRose(input);
      numOfDays = 10;
      applyUpdateQuality(numOfDays, gildedRose);
      expect(input).toEqual(
        expect.arrayContaining([expect.objectContaining({ quality: 50 })])
      );
    });

    test("Backstage passes' quality must be 0 after sellIn reached 0", () => {
      input = [
        new Item("Backstage passes to a TAFKAL80ETC concert", 2, 22),
        new Item("Backstage passes to a TAFKAL80ETC concert", 1, 11),
        new Item("Backstage passes to a TAFKAL80ETC concert", 3, 23),
      ];
      gildedRose = new GildedRose(input);
      numOfDays = 3;
      applyUpdateQuality(numOfDays, gildedRose);
      expect(input).toEqual(
        expect.arrayContaining([expect.objectContaining({ quality: 0 })])
      );
    });
  });
});
