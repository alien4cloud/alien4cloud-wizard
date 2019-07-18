class  LocationDependancy {
    name: string ;
    version: string ;
    hash: string ;
}

export class A4cLocation {

    id: string;
    name: string;
    orchestratorId: string;
    infrastructureType: string;
    dependencies: LocationDependancy[];
    metaProperties: {};
    creationDate: number;
    lastUpdateDate: number;
}
