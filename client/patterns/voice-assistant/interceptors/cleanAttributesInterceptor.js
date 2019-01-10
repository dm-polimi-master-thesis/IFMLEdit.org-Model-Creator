const cleanAttributesInterceptor = {
  process(handlerInput) {
      return new Promise((resolve, reject) => {
          var attributes = handlerInput.attributesManager.getSessionAttributes();
          if (attributes.demo) {
              attributes.demo = undefined;
          }
          if(attributes.notify) {
              attributes.notify = undefined;
          }

          handlerInput.attributesManager.setSessionAttributes(attributes);
          resolve();
      });
  }
};

exports.cleanAttributesInterceptor = cleanAttributesInterceptor;
