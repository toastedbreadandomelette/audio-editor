export type IdentifierFactory<
    Brandname extends string
> = symbol & {__brand: Brandname};
