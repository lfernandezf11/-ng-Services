import { Geo } from "./geo";

export interface Adress {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
}
