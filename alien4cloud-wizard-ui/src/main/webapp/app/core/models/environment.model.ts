import { ApplicationStatus } from '@app/core/models';

export class Environment {

    id: string ;
    status: ApplicationStatus ;
    name: string;
    applicationId: string ;
    environmentType: string ;
    currentVersionName: string ;
    userRoles: {}   ; 
    
}
