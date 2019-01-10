const WizardModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.attributesManager.getSessionAttributes().nextStep
            && handlerInput.attributesManager.getSessionAttributes().nextStep === 'wizard-pattern-handler';
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            answer = handlerInput.requestEnvelope.request.intent.slots.wizardPolicy.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        if (answer === 'default') {
            sessionAttributes.model.pattern.push('wizard-pattern');
            sessionAttributes.notify = {
              message: 'Default wizard payment procedure!',
              messageType: 'success'
            };
        } else if (answer === 'personal') {
            sessionAttributes.notify = {
              message: 'Personal wizard payment procedure!',
              messageType: 'success'
            };
        }

        switch (sessionAttributes.model.type) {
          case 'e-commerce':
              handlerInput.requestEnvelope.request.dialogState = 'COMPLETED';
              sessionAttributes.state = 'COMPLETED';
              sessionAttributes.nextStep = undefined;
              return handlerInput.responseBuilder
                  .speak('Great! I think we have finished. Visualize the result in IFMLEdit!')
                  .getResponse();
          default:
              return handlerInput.responseBuilder
                  .speak('Unexpected behaviour!')
                  .getResponse();
        }
    }
};

exports.WizardModelIntentHandler = WizardModelIntentHandler;
