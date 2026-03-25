import { Adress } from './adress';
import { Company } from "./company";

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Adress;
    phone: string;
    website: string;
    company: Company;
}
