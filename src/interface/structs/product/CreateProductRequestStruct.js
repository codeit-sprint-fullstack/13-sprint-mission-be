import { array, coerce, integer, min, nonempty, object, size, string } from 'superstruct';

const trimmedString = (struct) => coerce(struct, string(), (value) => value.trim());
const ProductNameStruct = trimmedString(size(string(), 1, 10));
const ProductDescriptionStruct = trimmedString(size(string(), 10, 100));
const ProductTagStruct = trimmedString(size(string(), 1, 5));

export const CreateProductRequestStruct = object({
    name: ProductNameStruct,
    description: ProductDescriptionStruct,
    price: min(integer(), 0),
    tags: size(array(ProductTagStruct), 1, Infinity),
    images: size(array(nonempty(string())), 0, 3),
});
