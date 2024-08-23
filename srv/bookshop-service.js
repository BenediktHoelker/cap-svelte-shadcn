import cds from '@sap/cds';

class BookshopService extends cds.ApplicationService {
	init() {
		const { Books } = cds.entities('eon');

		// Reduce stock of ordered books if available stock suffices
		this.on('submitOrder', async (req) => {
			let { book: id } = req.data;
			let book = await cds.read.from(Books, id, (b) => b.stock);
			return book;
		});

		// Delegate requests to the underlying generic service
		return super.init();
	}
}

export default BookshopService;
