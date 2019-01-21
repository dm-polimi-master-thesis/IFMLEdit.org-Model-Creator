// Copyright (c) 2index18, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    idValidator = require('../../../js/ifml/utilities/validator/idValidator.js').idValidator,
    toHash = require('../../../js/ifml/utilities/validator/toHash.js').toHash,
    configurator = require('../../../js/ifml/utilities/configurator/elementConfigurator.js').configurator,
    generator = require('../../../js/ifml/utilities/generator/elementGenerator.js').generator,
    format = require('./default.json'),
    xor = require('./xor.json');

function create(masterDetail){
  var template,
      modelElementsHash;

  if (masterDetail.xor) {
    template= _.cloneDeep(xor);
    modelElementsHash = toHash(template.elements);
    configurator(modelElementsHash['xor-view-container'], template, {
        name: masterDetail.name,
    });
  } else {
    template= _.cloneDeep(format);
    modelElementsHash = toHash(template.elements);
    configurator(modelElementsHash['master-detail-pattern-view-container'], template, {
        name: masterDetail.name,
    });
  }

  configurator(modelElementsHash['master-list-view-container'], template, {
      name: masterDetail.list.collection.charAt(0).toUpperCase() + masterDetail.list.collection.slice(1)
  });
  configurator(modelElementsHash['master-list'], template, {
      name: masterDetail.list.collection.charAt(0).toUpperCase() + masterDetail.list.collection.slice(1),
      collection: masterDetail.list.collection,
      fields: masterDetail.list.fields
  });
  configurator(modelElementsHash['master-details-view-container'], template, {
      name: masterDetail.details.name.charAt(0).toUpperCase() + masterDetail.details.name.slice(1)
  });
  configurator(modelElementsHash['master-details'], template, {
      name: masterDetail.details.name.charAt(0).toUpperCase() + masterDetail.details.name.slice(1),
      collection: masterDetail.list.collection,
      fields: masterDetail.details.fields
  });

  return template;
}

exports.create = create;
