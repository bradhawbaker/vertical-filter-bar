/*
 * Copyright © 2016-2017 European Support Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import CheckBoxControlFilter from './checkBoxFilterControl.jsx';
import DropDownControlFilter from './dropDownFilterControl.jsx';
import DateFilterControl from './dateFilterControl.jsx';

export function getFilterControlType (controlFilterConfig) {
	var Type; // make sure this var starts with a capital letter
	if(controlFilterConfig.type === 'checkBox'){
		Type = CheckBoxControlFilter;
	}  else if (controlFilterConfig.type === 'dropDown'){
    Type = DropDownControlFilter;
  }	else if(controlFilterConfig.type === 'date'){
    Type = DateFilterControl;
  } else{
		console.log('ERROR: Type ' + controlFilterConfig.type + ' unknown.');
	}
	return Type;
}