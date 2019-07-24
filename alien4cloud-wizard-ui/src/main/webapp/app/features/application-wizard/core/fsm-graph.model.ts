import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {WizardService} from "@app/features/application-wizard/core/wizard.service";

export class FsmGraph {
  nodes: FsmGraphNode[] = [];
  edges: FsmGraphEdge[] = [];
}

export class FsmGraphNode {
  id: string;
  label: string;
  /** Indicates that this state has already been activated. */
  public activated: boolean;
  /** Indicates that this state is currently activated. */
  public active: boolean;
  constructor(
    id: string,
    label: string
  ) {
    this.id = id;
    this.label = label;
  }
}

export class FsmGraphEdge {
  /** Indicates that this transition is the last one. */

  constructor(
    public id: string,
    public source: string,
    public target: string,
    public label: string,
    public data: any[]
  ) {}
}

