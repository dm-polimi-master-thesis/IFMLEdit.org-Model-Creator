const CrowdPolicyModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CreateModelIntent'
            && handlerInput.attributesManager.getSessionAttributes().nextStep
            && handlerInput.attributesManager.getSessionAttributes().nextStep === 'crowd-policy-handler';
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            answer = handlerInput.requestEnvelope.request.intent.slots.crowdPolicy.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        if (answer === 'publish') {
            sessionAttributes.model.pattern.push('master-policy');
            sessionAttributes.notify = {
              message: 'Master Policy',
              messageType: 'success'
            };
        } else if (answer === 'perform') {
            sessionAttributes.model.pattern.push('worker-policy');
            sessionAttributes.notify = {
              message: 'Worker Policy',
              messageType: 'success'
            };
        }

        switch (sessionAttributes.model.type) {
          case 'crowdsourcing':
              sessionAttributes.nextStep = 'master-details-pattern-handler';

              return handlerInput.responseBuilder
                  .speak('Are tasks relative to the same topic or they can be divided in categories and subcategories?')
                  .addElicitSlotDirective('masterDetailsPattern')
                  .getResponse();
          default:
              return handlerInput.responseBuilder
                  .speak('Unexpected behaviour!')
                  .getResponse();
        }
    }
};

exports.CrowdPolicyModelIntentHandler = CrowdPolicyModelIntentHandler;
