# How it works

The wizard logic is handled by a state machine thanx to https://xstate.js.org project.

![WizardArchitecture](readme-wizard-arch.png)

The FSM manages our state machine. It's configuration can be found in `core/fsm.config.ts`.
It's configuration consist of:
* steps
* events that trigger transition between steps

Some of the steps of our FSM are related to a `WizardFormComponent` : in these steps, the FSM is waiting for user inputs.
A wizard form component should only send events to the FSM (to trigger a transition).

The `WizzardMainComponent` is in charge of :
* listening to FSM state change events.
* managing the Stepper.
* displaying the form component in the step container if the current step is related to a form.

Each event transport a context that is defined in ``ApplicationWizardMachineContext`` ([core/fsm.model.ts](src/main/webapp/app/features/application-wizard/core/fsm.model.ts))
We store here data that have a meaning concerning the wizard (it not a _fourre tout_). Usually, user inputs or ids returned by backend (that are both sent through events) are stored in this context.

# How-To update the FSM config

If you need to implement something new in the wizard, you'll probably need to add some states, events, and configure somme transitions in the FSM.

You must have a clear idea of what you need. If not, draw your state chart on a paper or whatever you want. 

* declare your states in ``ApplicationWizardMachineSchema`` ([core/fsm.model.ts](src/main/webapp/app/features/application-wizard/core/fsm.model.ts)).
* add your event classes in [core/fsm.events.ts](src/main/webapp/app/features/application-wizard/core/fsm.events.ts).
* if you need something new in the context add it in ``ApplicationWizardMachineContext`` ([core/fsm.model.ts](src/main/webapp/app/features/application-wizard/core/fsm.model.ts)). You'll also need to upate the initial context initialization in the constant ``context`` in [core/fsm.config.ts](src/main/webapp/app/features/application-wizard/core/fsm.config.ts).
* don't forget to declare your new states types in ``ApplicationWizardMachineEvents``.
* declare your actions and services in ``AppplicationWizardMachineService.machineOptions`` ([core/fsm.service.ts](src/main/webapp/app/features/application-wizard/core/fsm.service.ts)).
* add your states and transition configuration in ``applicationWizardMachineConfig`` ([core/fsm.config.ts](src/main/webapp/app/features/application-wizard/core/fsm.config.ts)). 

# How-To add a form step in the wizard

A form step is a form component that is related to a given state of the state machine.
Before creating a form step, you must known to which FSM state it is related. 

Then :

* create a component in the folder 'wizard-forms'
* make your component implement ``WizardFormComponent`` . You'll then need to define an input of type ``ApplicationWizardMachineContext``. We need this to inject the FSM context when the component will be created.

`@Input() fsmContext: ApplicationWizardMachineContext;`

* Inject the FSM in the constuctor (you'll need it to send an event to the state machine) :

`constructor(private fsm: AppplicationWizardMachineService) { }`
 
* declare your component in the ``entryComponents`` of the ``ApplicationWizardModule``.
* finally declare your form step in ``core/wizard.service.ts``

Remeber that a form step component should only :
* Read values from the fsmContext
* Send events to the state machine.

**That all folks !**

