const GenerateViewContainerModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GenerateViewContainerModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            name = handlerInput.requestEnvelope.request.intent.slots.name.value,
            properties = handlerInput.requestEnvelope.request.intent.slots.properties.value ? handlerInput.requestEnvelope.request.intent.slots.properties.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            message;

        if (name) {
            var message = 'New ';

            if (properties) {
                message += properties + ' '

                switch (properties) {
                  case 'landmark and default':
                      properties = {
                          xor: false,
                          landmark: true,
                          default: true
                      }
                      break;
                  case 'landmark':
                      properties = {
                          xor: false,
                          landmark: true,
                          default: false
                      }
                      break;
                  case 'default':
                      properties = {
                          xor: false,
                          landmark: true,
                          default: true
                      }
                      break;
                  case 'xor':
                      properties = {
                          xor: true,
                          landmark: false,
                          default: false
                      }
                      break;
                  default:

                }
            }

            message += 'View Container with name ' + name;

            sessionAttributes.notify = {
                message: message,
                messageType: 'success'
            };
            sessionAttributes.advanced = {
                operation: 'generate-view-container',
                options: {
                    name: name,
                    properties: properties || {}
                }
            }
            return handlerInput.responseBuilder
                .speak('done')
                .withShouldEndSession(false)
                .getResponse();
        } else {
            sessionAttributes.notify = {
                message: 'Specify the name of the new View Container',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
    }
};

exports.GenerateViewContainerModelIntentHandler = GenerateViewContainerModelIntentHandler;
