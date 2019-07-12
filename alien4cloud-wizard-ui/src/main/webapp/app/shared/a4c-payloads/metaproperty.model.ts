import { DefaultMeta } from './default-meta.model';

export class Metaproperty {
    type: string ;
    required: string;
    description: string;
    id: string;
    name: string;
    target: string;
    filtered: boolean;
    constraints: [];
    default: DefaultMeta ;
    password: Boolean;
    definition: Boolean;
}
