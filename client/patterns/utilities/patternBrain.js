// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var alphabeticalFilterBrain = require('../collection/alphabetical-filter/brain.js').brain;

function patternBrain (options) {
    var pattern = options.cell.attributes.pattern[0].value;

    options.pattern = options.cell.attributes.pattern[0];

    switch (pattern) {
      case 'alphabetical filter':
        alphabeticalFilterBrain(options);
        break;
      case 'basic search':

        break;
      case 'content management':

        break;
      case 'faceted search':

        break;
      case 'in-place log in':

        break;
      case 'input data validation':

        break;
      case 'master details':

        break;
      case 'multilevel master details':

        break;
      case 'restricted search':

        break;
      case 'sign up and log in':

        break;
      case 'wizard':

        break;
      default:
        throw 'Unexpected pattern name';
    }
}

exports.patternBrain = patternBrain;
