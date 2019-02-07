// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var templates = [];

templates['alphabetical filter'] = require('./alphabetical-filter/create.js');
templates['basic search'] = require('./basic-search/create.js');
templates['content management'] = require('./content-management/create.js');
templates['faceted search'] = require('./faceted-search/create.js');
templates['in place log in'] = require('./in-place-log-in/create.js');
templates['input data validation'] = require('./input-data-validation/create.js');
templates['master detail'] = require('./master-detail/create.js');
templates['multilevel master detail'] = require('./multilevel-master-detail/create.js');
templates['restricted search'] = require('./restricted-search/create.js');
templates['sign up log in'] = require('./sign-up-log-in/create.js');
templates['wizard'] = require('./wizard/create.js');

exports.templates = templates;
