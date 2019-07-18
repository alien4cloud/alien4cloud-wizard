import { ApplicationStatus } from './application-status.enum';

export class Environment {

    id: string ;
    status: ApplicationStatus ;
    name: string;
    applicationId: string ;
    environmentType: string ;
    currentVersionName: string ;
    userRoles: {}   ; 
    
}
