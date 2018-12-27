// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var Alexa = require('ask-sdk-core'),
    speakText,
    repromptText;

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    speechText = "Welcome to the IFML Model Creator tool. How can I help you?";
    repromptText = "Do you want to build a model for an application?";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .withSimpleCard('IFML Model Creator Tool',speechText
      .getResponse();
  }
};

const CreateModelIntent = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' && handlerInput.requestEnvelope.request.name = 'CreateModelIntent';
  },
  handle(handlerInput) {
    speechText = "Welcome to the IFML Model Creator tool. Let's start: the application requires to be registered in order to perform operations?";
    repromptText = "The application requires to be registered in order to perform operations?";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .withSimpleCard('IFML Model Creator Tool',speechText)
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can ask to help you to build a model for a new application!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('IFML Model Creator Tool', speechText)
      .getResponse();
  }
};
