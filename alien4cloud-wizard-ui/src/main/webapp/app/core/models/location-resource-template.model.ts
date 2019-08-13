import {AbstractTemplate, NodeTemplate, PolicyTemplate, PropertyDefinition} from "@app/core";

export interface ISecurityEnabledResource {

}

export interface AbstractSecurityEnabledResource extends ISecurityEnabledResource {

}


export interface AbstractLocationResourceTemplate<T extends AbstractTemplate> extends AbstractSecurityEnabledResource {
  id: string;
  name: string;
  locationId: string;
  enabled: boolean;
  isService: boolean;
  types: string[];
  portabilityDefinitions: Map<string, PropertyDefinition>;
  template: T;
}


export interface LocationResourceTemplate extends AbstractLocationResourceTemplate<NodeTemplate> {
  generated: boolean;
}

export interface PolicyLocationResourceTemplate extends AbstractLocationResourceTemplate<PolicyTemplate> {

}

export interface DeploymentSubstitutionConfiguration {
  availableSubstitutions: Map<string, Set<String>>;
  substitutionsTemplates: Map<string, LocationResourceTemplate>;
  availablePoliciesSubstitutions: Map<string, Set<string>>;
  substitutionsPoliciesTemplates: Map<string, PolicyLocationResourceTemplate>;
  // substitutionTypes: LocationResourceTypes;
}
