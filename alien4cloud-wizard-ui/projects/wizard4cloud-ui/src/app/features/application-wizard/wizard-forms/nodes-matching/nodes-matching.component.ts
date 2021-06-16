import {AfterViewInit, Compiler, Component, Injector, ViewChild, ViewContainerRef} from '@angular/core';
import {AppplicationWizardMachineService} from "@app/features/application-wizard/core/fsm.service";
import {OnMatchingCompleted} from "@app/features/application-wizard/core/fsm.events";
import {MatRadioChange} from "@angular/material";
import {DeploymentTopologyService} from "@app/core/services";
import {WizardFormComponent} from "@app/features/application-wizard/core/wizard.model";
import {ReplaySubject} from "rxjs";
import {SuggestionContextType, TemplatePropertiesEditorWrapper, UpdatePropertyRequest} from "@app/core/models";

@Component({
  selector: 'w4c-nodes-matching',
  templateUrl: './nodes-matching.component.html',
  styleUrls: ['./nodes-matching.component.css']
})
export class NodesMatchingComponent extends WizardFormComponent implements AfterViewInit {

  @ViewChild('content', { read: ViewContainerRef, static: false }) content: ViewContainerRef;

  private selectedKey: string;
  private selectedType: string;
  private selectedNodeId: string;

  private wrapperSubject = new ReplaySubject<TemplatePropertiesEditorWrapper>(1);
  wrapperSubject$ = this.wrapperSubject.asObservable();

  constructor(
    protected fsm: AppplicationWizardMachineService,
    private deploymentTopologyService: DeploymentTopologyService,
    private _compiler: Compiler, private _injector: Injector
  ) { super(fsm); }

  ngAfterViewInit() {
    //this.loadPlugins();
  }

  // private async loadPlugins() {
  //   // import external module bundle
  //   const module = await import("/Users/xdegenne/work/angular-workspace/core-app/src/assets/plugins/plugin-a.bundle.js");
  //
  //   // compile module
  //   const moduleFactory = await this._compiler
  //     .compileModuleAsync<any>(module["PluginAModule"]);
  //
  //   // resolve component factory
  //   const moduleRef = moduleFactory.create(this._injector);
  //
  //   //get the custom made provider name 'plugins'
  //   const componentProvider = moduleRef.injector.get('plugins');
  //
  //   //from plugins array load the component on position 0
  //   const componentFactory = moduleRef.componentFactoryResolver
  //     .resolveComponentFactory<any>(
  //       componentProvider[0][0].component
  //     );
  //
  //   // compile component
  //   var pluginComponent = this.content.createComponent(componentFactory);
  //
  //   //sending @Input() values
  //   //pluginComponent.instance.anyInput = "inputValue";
  //
  //   //accessing the component template view
  //   //(pluginComponent.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
  // }

  changeSubstitution(nodeName: string, e: MatRadioChange) {
    console.log(`Substitution has changed for ${nodeName}:`, e.value);
    this.selectedKey = e.value;
    this.selectedType = "node";
    this.deploymentTopologyService
      .updateSubstitution(this.fsmContext.application.id, this.fsmContext.environment.id, nodeName, e.value)
      .subscribe(dto => { this.fsmContext.deploymentTopologyDTO = dto; });
  }

  changePoliciesSubstitution(policyId: string, e: MatRadioChange) {
    console.log(`Substitution has changed for ${policyId}:`, e.value);
    this.selectedKey = e.value;
    this.selectedType = "policy";
    this.deploymentTopologyService
      .updatePoliciesSubstitution(this.fsmContext.application.id, this.fsmContext.environment.id, policyId, e.value)
      .subscribe(dto => {
        this.fsmContext.deploymentTopologyDTO = dto;
        this.loadEditor(policyId);
      }
      );
  }

  loadEditor(templateId: string) {
    this.selectedNodeId = templateId;
    if (this.selectedType == "policy") {
      let wrapper: TemplatePropertiesEditorWrapper = new TemplatePropertiesEditorWrapper();
      wrapper.properties = this.fsmContext.deploymentTopologyDTO.topology.policies[templateId];
      let type = this.fsmContext.deploymentTopologyDTO.topology.policies[templateId].type;
      wrapper.definitions = this.fsmContext.deploymentTopologyDTO.policyTypes[type];
      this.wrapperSubject.next(wrapper);
    }
    //this.fsmContext.deploymentTopologyDTO.topology.po
  }

  doCompleteMatching() {
    this.fsm.send(new OnMatchingCompleted(this.fsmContext.deploymentTopologyDTO));
  }

  isSubstitutionValid() {
    return (!this.fsmContext.deploymentTopologyDTO.validation.taskList || this.fsmContext.deploymentTopologyDTO.validation.taskList.length == 0);
  }

  displayPoliciesSubstitution(key: string, value: string) {
    this.selectedType = "policy";
    this.selectedKey = value;
    this.fsmContext.propertyEditionContext.type = SuggestionContextType.DeploymentPolicyMatching;
    this.fsmContext.propertyEditionContext.data.resourceId = value;
    this.fsmContext.propertyEditionContext.data.policyId = key;
    console.log(`Display Substitution for ${key}: ${value}`);
    this.loadEditor(key);
  }

  onPropertyValueChanged($event: UpdatePropertyRequest) {
    console.log("===== onPropertyValueChanged : " + $event);
    if (this.selectedType == "policy") {
      this.deploymentTopologyService.updatePolicySubstitutionProperty(
        this.fsmContext.application.id,
        this.fsmContext.environment.id,
        this.selectedNodeId,
        $event).subscribe(dto => { this.fsmContext.deploymentTopologyDTO = dto; });
    }
  }

}
