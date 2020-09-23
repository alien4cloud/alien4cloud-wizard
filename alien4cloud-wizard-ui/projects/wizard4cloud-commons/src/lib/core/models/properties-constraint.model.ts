import {PropertyDefinition} from "./properties.model";

export interface PropertyConstraint {
}

export interface AbstractPropertyConstraint extends PropertyConstraint {
}

export interface ValidValuesConstraint extends AbstractPropertyConstraint {
  validValues: string[];
}

export namespace PropertyConstraintUtils {
  /**
   * If a property has a valid_values constraint, return the first one found.
   */
  export function getValidValuesConstraint(pd: PropertyDefinition): ValidValuesConstraint {
    let result: ValidValuesConstraint = undefined;
    if (pd.constraints) {
      pd.constraints.forEach(constraint => {
        if (constraint.hasOwnProperty('validValues')) {
          result = constraint as ValidValuesConstraint;
        }
      });
    }
    return result;
  }
}
