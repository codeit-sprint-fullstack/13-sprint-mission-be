import { array, coerce, integer, max, min, nonempty, object, refine, size, string } from 'superstruct';

const trimmedString = (struct) => coerce(struct, string(), (value) => value.trim());
const ProductNameStruct = refine(
    trimmedString(size(string(), 1, 10)),
    'ProductName',
    (value) => /[\p{L}\p{N}]/u.test(value),
);
const ProductDescriptionStruct = trimmedString(size(string(), 10, 100));
const ProductTagStruct = trimmedString(size(string(), 1, 5));

export const CreateProductRequestStruct = object({
    name: ProductNameStruct,
    description: ProductDescriptionStruct,
    price: max(min(integer(), 1), 2_147_483_647),
    tags: size(array(ProductTagStruct), 1, Infinity),
    images: size(array(nonempty(string())), 0, 3),
});
