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
import React from 'react';
import FilterControl from './filterControl';
import isEmpty from 'lodash/isEmpty';
import Select from 'react-select';
import i18n from '../../utils/i18n/i18n.js';

class DropDownFilterControl extends FilterControl{

  handleChange(value){
    let selectedValues = {};

    if (!isEmpty(value)){
      selectedValues.values = value;
    }

    this.props.onFilterControlChange(selectedValues, this.props.controlId);
  }

  getSelectOptions (){
    return this.props.dynamicOptions;
  }

  getSelectValues(){
    let selectedValues = null;

    if (!isEmpty(this.props.currentCriterion)){
      selectedValues = [];
      let configValue = this.props.currentCriterion.values;
      if (!Array.isArray(configValue)){
        selectedValues.push(configValue);
      }
      else{
        selectedValues = configValue;
      }

      selectedValues = selectedValues.map((value)=>{
        return {
          //Whether it came from default filters as a string (value)
          //Or from configuration as an object (code/decode)
          'code': isEmpty(value.code) ? value : value.code,
          'decode': isEmpty(value.decode) ? value : value.decode,
        };
      });

    }
    return selectedValues;
  }

  render(){
    let multiSelect = ( this.props.config.multiSelect === true) ;
    let dropdownValue = this.getSelectValues();

    if (!isEmpty(dropdownValue) && !multiSelect){
      dropdownValue = dropdownValue[0];
    }

    let searchable = (typeof this.props.config.searchable === 'undefined') ? true : this.props.config.searchable;
    let className = 'dropdown-filter-control ' + this.props.controlId;
    return (
      <div className={className} >
        <div className='label'>{i18n(this.props.config.label)}</div>
        <Select
          multi={multiSelect}
          placeholder = {i18n(this.props.config.watermark)}
          value={dropdownValue}
          labelKey = 'decode'
          valueKey = 'code'
          searchable = {searchable}
          options = {this.getSelectOptions()}
          onChange = {this.handleChange.bind(this)}
        >
        </Select>
      </div>
    );
  }
}

export default DropDownFilterControl;
