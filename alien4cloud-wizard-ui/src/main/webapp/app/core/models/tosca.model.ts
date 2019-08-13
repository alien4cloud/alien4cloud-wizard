import {HasTags, Tag} from "@app/core/models";

export class AbstractToscaType implements HasTags {
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
