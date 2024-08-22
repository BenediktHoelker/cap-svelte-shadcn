const cds = require("@sap/cds");

class BookshopService extends cds.ApplicationService {
  init() {
    const { Books } = cds.entities("eon");

    // Reduce stock of ordered books if available stock suffices
    this.on("submitOrder", async (req) => {
      let { book: id } = req.data;
      let book = await SELECT.from(Books, id, (b) => b.stock);

      //   // Validate input data
      //   if (!book) return req.error(404, `Book #${id} doesn't exist`);
      //   if (quantity < 1) return req.error(400, `quantity has to be 1 or more`);
      //   if (quantity > book.stock)
      //     return req.error(409, `${quantity} exceeds stock for book #${id}`);

      //   // Reduce stock in database and return updated stock value
      //   await UPDATE(Books, id).with({ stock: (book.stock -= quantity) });
      return book;
    });

    // // Emit event when an order has been submitted
    // this.after("submitOrder", async (_, req) => {
    //   let { book, quantity } = req.data;
    //   await this.emit("OrderedBook", { book, quantity, buyer: req.user.id });
    // });

    // Delegate requests to the underlying generic service
    return super.init();
  }
}

module.exports = BookshopService;
