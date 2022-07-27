export class Item {
  name: string;
  sellIn: number; // num. of days to sell the item
  quality: number; // how valuable an item is, never negative
  // quality is never more than 50

  // Sulfuras is legendary, never gets sold or decreased
  // Quality for Sulfuras is 80 and does not change.

  // Backstage passes is like aged brie,
  // Quality increases by 2 when there are 10 days or less
  // by 3 when there are 5 days or less
  // quality drops to zero after concert

  /*  "Conjured" items degrade in Quality twice as fast as normal items */
  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}
/* at the end of the day system 
   lowers both values for every item
*/

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality(): Array<Item> {
    for (let i: number = 0; i < this.items.length; i++) {
      const currItem: Item = this.items[i];
      let degrationRate: number = currItem.name.includes("Conjured") ? 2 : 1;
      switch (currItem.name) {
        case "Sulfuras, Hand of Ragnaros":
          // quality is constant, can't be sold, no action needed.
          break;
        case "Aged Brie":
          currItem.quality < 50 && currItem.quality++;
          currItem.sellIn--;
          break;
        case "Backstage passes to a TAFKAL80ETC concert":
          const daysLeft: number = currItem.sellIn;
          if (daysLeft - 1 <= 0) {
            // quality drops to 0 after concert day
            currItem.quality = 0;
          } else {
            /* controlling the additions in order to make sure 
               quality value won't be greater than 50.
               for ex. if daysLeft is 2, and quality is 48; additional quality value will be 2 instead of 3.
            */
            daysLeft <= 5
              ? (currItem.quality =
                  currItem.quality +
                  (currItem.quality >= 47 ? 50 - currItem.quality : 3))
              : daysLeft > 5 && daysLeft <= 10
              ? (currItem.quality =
                  currItem.quality +
                  (currItem.quality >= 48 ? 50 - currItem.quality : 2))
              : currItem.quality++;
          }
          currItem.sellIn--;
          break;

        default:
          if (currItem.sellIn <= 0) {
            degrationRate = degrationRate * 2;
          }
          if (currItem.quality - degrationRate >= 0) {
            currItem.quality = currItem.quality - degrationRate;
          }
          currItem.sellIn--;
          break;
      }
      this.items[i] = currItem;
    }

    return this.items;
  }
}
