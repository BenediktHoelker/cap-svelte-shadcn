using {eon as my} from '../db/schema';

service BookshopService {
    entity Books   as projection on my.Books;
    entity Authors as projection on my.Authors;
    action submitOrder(book : Books:ID);
}
