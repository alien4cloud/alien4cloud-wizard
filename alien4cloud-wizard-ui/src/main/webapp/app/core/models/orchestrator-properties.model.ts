export enum DefinitionIdValues {
  managerEmail,
  managementUrl,
  NumberBackup
}


export interface DeploymentPropertyCheck {
  definitionId: DefinitionIdValues;
  value: string;
}

export interface OrchestratorPropertiesConstraints {
  pattern: string;
  greaterOrEqual : string ;

}

export interface OrchestratorPropertiesEntry {
  type: string;
  entrySchema : string;
  required: boolean;
  description: string;
  suggestionId: string;
  constraints: OrchestratorPropertiesConstraints[] ;
  default: string;
  password: boolean;
  definition: boolean
}

export interface OrchestratorProperties {
  managerEmail : OrchestratorPropertiesEntry ;
  managementUrl : OrchestratorPropertiesEntry ;
  NumberBackup : OrchestratorPropertiesEntry ;
}
