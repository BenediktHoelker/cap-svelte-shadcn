using {
    cuid,
    managed
} from '@sap/cds/common';

namespace eon;

entity Books : cuid, managed {
    title  : String                 @title: 'Title';
    author : Association to Authors @title: 'Author';
};

entity Authors : cuid, managed {
    name : String @title: 'Name';
}

entity Tasks : managed {
    key id       : String;
        title    : String;
        status   : String;
        label    : String;
        priority : String;
}
