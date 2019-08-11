import {HasTags, Tag} from "@app/core/models";

export interface AbstractToscaType extends HasTags {
  archiveName: string;
  archiveVersion: string;
  elementId: string;
  description: string;
}

export interface AbstractInheritableToscaType extends AbstractToscaType {

}

export interface AbstractInstantiableToscaType extends AbstractInheritableToscaType {

}

export interface NodeType extends AbstractInstantiableToscaType {

}
