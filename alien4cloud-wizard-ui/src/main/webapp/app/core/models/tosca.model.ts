import {Tag} from "@app/core/models";

export class AbstractToscaType {
  archiveName: string;
  archiveVersion: string;
  elementId: string;
  description: string;
  tags: Tag[];
}

export class AbstractInheritableToscaType extends AbstractToscaType {

}

export class AbstractInstantiableToscaType extends AbstractInheritableToscaType {

}

export class NodeType extends AbstractInstantiableToscaType {

}
