import angular from 'angular';
import 'angular-sanitize';
import 'ui-select';
import 'ui-select/dist/select.css!';
import 'selectize/css/selectize.bootstrap3.css!';
import 'selectize/css/selectize.css!';

import 'jquery';

/**
 * This is useful for putting all the imports in one place.
 */
let selectModule = angular.module('gl.selectModule', [
	'ngSanitize',
	'ui.select'
]);

export default selectModule;
