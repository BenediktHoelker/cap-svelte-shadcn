using {BookshopService as my} from './bookshop-service';


annotate my.Authors with @UI: {LineItem: [{
    $Type: 'UI.DataField',
    Value: name,
}, ], } {
    ID @(
        UI    : {Hidden, },
        Common: {
            Text           : name,
            TextArrangement: #TextOnly,
        }
    )
};

annotate my.Books with @UI: {LineItem: [
    {
        $Type: 'UI.DataField',
        Value: title,
    },
    {
        $Type: 'UI.DataField',
        Value: author.name,
    },
    {
        $Type        : 'UI.DataFieldForAction',
        Action       : 'BookshopService.EntityContainer/submitOrder',
        Label        : 'Submit Order',
        Inline       : true,
        ![@UI.Hidden]: {$edmJson: {$Eq: [
            {$Path: 'title'},
            'Eleonora'
        ]}}
    },
]};
