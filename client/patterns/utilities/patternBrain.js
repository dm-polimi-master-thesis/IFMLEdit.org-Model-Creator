// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var alphabeticalFilterBrain = require('../collection/alphabetical-filter/brain.js').brain,
    basicSearchBrain = require('../collection/basic-search/brain.js').brain,
    contentManagementBrain = require('../collection/content-management/brain.js').brain,
    facetedSearchBrain = require('../collection/faceted-search/brain.js').brain,
    inPlaceLogInBrain = require('../collection/in-place-log-in/brain.js').brain,
    inputDataValidationBrain = require('../collection/input-data-validation/brain.js').brain,
    masterDetailsBrain = require('../collection/master-detail/brain.js').brain,
    multilevelMasterDetailsBrain = require('../collection/multilevel-master-detail/brain.js').brain,
    restrictedSearchBrain = require('../collection/restricted-search/brain.js').brain,
    signUpLogInBrain = require('../collection/sign-up-log-in/brain.js').brain,
    wizardBrain = require('../collection/wizard/brain.js').brain;

function patternBrain (options) {
    var pattern = options.cell.attributes.pattern[0].value;

    options.pattern = options.cell.attributes.pattern[0];

    switch (pattern) {
      case 'alphabetical filter':
        alphabeticalFilterBrain(options);
        break;
      case 'basic search':
        basicSearchBrain(options);
        break;
      case 'content management':
        contentManagementBrain(options)
        break;
      case 'faceted search':
        facetedSearchBrain(options)
        break;
      case 'in-place log in':
        inPlaceLogInBrain(options)
        break;
      case 'input data validation':
        inputDataValidationBrain(options)
        break;
      case 'master details':
        masterDetailsBrain(options)
        break;
      case 'multilevel master details':
        multilevelMasterDetailsBrain(options)
        break;
      case 'restricted search':
        restrictedSearchBrain(options)
        break;
      case 'sign up and log in':
        signUpLogInBrain(options)
        break;
      case 'wizard':
        wizardBrain(options)
        break;
      default:
        throw 'Unexpected pattern name';
    }
}

exports.patternBrain = patternBrain;
