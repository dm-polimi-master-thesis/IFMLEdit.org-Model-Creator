const ResizeElementModelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ResizeElementModelIntent'
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes(),
            name = handlerInput.requestEnvelope.request.intent.slots.name.value,
            type = handlerInput.requestEnvelope.request.intent.slots.type.value ? handlerInput.requestEnvelope.request.intent.slots.type.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            direction = handlerInput.requestEnvelope.request.intent.slots.direction.value ? handlerInput.requestEnvelope.request.intent.slots.direction.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            sign = handlerInput.requestEnvelope.request.intent.slots.sign.value ? handlerInput.requestEnvelope.request.intent.slots.sign.resolutions.resolutionsPerAuthority[0].values[0].value.name : undefined,
            delta = handlerInput.requestEnvelope.request.intent.slots.delta.value,
            message;

        if (direction && delta) {
            message = 'Resize ';

            delta = delta / 10 > 0 ? (delta - (delta % 10)) : 10;

            if (sign && sign === 'minus') {
                delta *= -1;
            }

            if (name && type) {
                message += name + ' ' + type;
            } else if (name && !type) {
                return handlerInput.responseBuilder
                    .speak('What is the type of the element you want to resize?')
                    .addElicitSlotDirective('type')
                    .getResponse();
            } else if (!name && type) {
                return handlerInput.responseBuilder
                    .speak('What is the name of the element you want to resize?')
                    .addElicitSlotDirective('name')
                    .getResponse();
            }

            message += direction + ' for ' + delta + ' px';

            sessionAttributes.notify = {
                message: message,
                messageType: 'success',
                advanced: true
            };
            sessionAttributes.advanced = {
                operation: 'resize',
                options: {
                    name: name,
                    type: type,
                    direction: direction,
                    delta: delta,
                    sign: sign || 'plus'
                }
            }
            return handlerInput.responseBuilder
                .speak('done')
                .withShouldEndSession(false)
                .getResponse();
        } else {
            if (!direction && delta) {
                message = 'direction'
            } else if (direction && !delta) {
                message = 'the numbers of pixels'
            } else if (!name && !type) {
                message = 'direction and number of pixels'
            }

            sessionAttributes.notify = {
                message: 'Specify ' + message + ' to resize the element.',
                messageType: 'warning'
            };
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
    }
};

exports.ResizeElementModelIntentHandler = ResizeElementModelIntentHandler;
