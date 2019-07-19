import { TopologyNestedVersion } from '@app/core/models';

export class TopologyTemplate {  
    archiveName: string ;
    archiveVersion: string ;
    nestedVersion: TopologyNestedVersion;
    workspace: string;
    description: string;
    creationDate: number;
    lastUpdateDate: number;
    dependencies: [];
    unprocessedWorkflows: {} ;
    empty: boolean ;
    id: string ;
}

