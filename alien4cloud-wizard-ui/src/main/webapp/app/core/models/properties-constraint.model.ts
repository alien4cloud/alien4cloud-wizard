import {PropertyDefinition} from "./properties.model";

export interface PropertyConstraint {

}

export abstract class AbstractPropertyConstraint implements PropertyConstraint {

}

export class ValidValuesConstraint extends AbstractPropertyConstraint {
  validValues: string[];
}

export namespace PropertyConstraintUtils {
  /**
   * Indicates that the status is a changing status, a "doing something" status.
   */
  export function getValidValuesConstraint(pd: PropertyDefinition): ValidValuesConstraint {
    let result: ValidValuesConstraint;
    if (pd.constraints) {
      pd.constraints.forEach(constraint => {
        // FIXME: why can't I just check if instanceof ValidValuesConstraint ?
        if (constraint.hasOwnProperty('validValues')) {
          result = constraint as ValidValuesConstraint;
        }
      });
    }
    return result;
  }
}
