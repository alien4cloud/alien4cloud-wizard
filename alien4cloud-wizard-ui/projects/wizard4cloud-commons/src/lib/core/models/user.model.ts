
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

  /**
   * Decide if a user can create an app depending on its roles.
   */
  export function canBrowseModules(roles: Role[]) : boolean {
    if (!roles || roles.length == 0) {
      return false;
    }
    for (let i=0; i < roles.length; i++) {
      if (roles[i] == Role.ADMIN || roles[i] == Role.COMPONENTS_BROWSER || roles[i] == Role.COMPONENTS_MANAGER || roles[i] == Role.ARCHITECT) {
        return true;
      }
    }
    return false;
  }
}

export class Feature {
  public active: boolean;
  constructor(
    public id: string,
    public iconName: string,
    public activationLink: string,
    public allowed: boolean,
    public enabled: boolean
  ) { }
}
