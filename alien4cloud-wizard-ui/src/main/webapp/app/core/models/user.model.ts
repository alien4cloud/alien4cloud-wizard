
export interface UserStatus {
  isLogged: boolean;
  username: string;
  githubUsername: any;
  roles: Role[];
  groups: string[];
  authSystem: string;
}

export enum Role {
  ADMIN = "ADMIN",
  APPLICATIONS_MANAGER = "APPLICATIONS_MANAGER",
  ARCHITECT = "ARCHITECT",
  COMPONENTS_MANAGER = "COMPONENTS_MANAGER",
  COMPONENTS_BROWSER = "COMPONENTS_BROWSER"
}

export namespace User {
  /**
   * Decide if a user can create an app depending on its roles.
   */
  export function canCreateApp(roles: Role[]) : boolean {
    if (!roles || roles.length == 0) {
      return false;
    }
    for (let i=0; i < roles.length; i++) {
      if (roles[i] == Role.ADMIN || roles[i] == Role.APPLICATIONS_MANAGER) {
        return true;
      }
    }
    return false;
  }
}
