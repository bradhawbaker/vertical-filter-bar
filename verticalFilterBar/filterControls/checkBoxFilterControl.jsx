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
import isEmpty from 'lodash.isEmpty';
import isEqual from 'lodash.isEqual';
import differenceWith from 'lodash/differenceWith';
import pull from 'lodash/pull';

class CheckBoxFilterControl extends FilterControl{

    toggleCheckbox(checkboxConfig) {
        let selectedCheckboxes = [];
        if (!isEmpty(this.props.currentCriterion)){
            let valuesFromConfig = this.props.currentCriterion.values;
            if (!Array.isArray(valuesFromConfig)){
                selectedCheckboxes.push(valuesFromConfig);
            }
            else{
                selectedCheckboxes = Object.assign(valuesFromConfig, {});
            }
            
        }

        let checkboxValue = checkboxConfig.code;
        if (selectedCheckboxes.indexOf(checkboxValue) >= 0){
            pull(selectedCheckboxes, checkboxValue);
        } 
        else {
            selectedCheckboxes.push(checkboxValue);
        }

        let selectedValues = {};
        
         if (!isEmpty(selectedCheckboxes)){
            selectedValues.values = selectedCheckboxes;
         }

        this.props.onFilterControlChange(selectedValues, this.props.controlId);
    }

    getCheckboxConfigs(){
        return this.props.dynamicOptions;
    }

    getAllOptions(){
        let checkboxConfigs = this.getCheckboxConfigs();
        let allOptions = [];
        if(!isEmpty(checkboxConfigs)){
            checkboxConfigs.map((checkboxConfig)=>{
                allOptions.push(checkboxConfig.code);
            });
        }
        
        return allOptions;
    }

    onSelectAllToggle(event){
        let selectedCheckboxes = [];
        if(event.target.checked){
            selectedCheckboxes = this.getAllOptions(); 
        }

        let selectedValues = {};
        if (!isEmpty(selectedCheckboxes)){
            selectedValues.values = selectedCheckboxes;            
        }

        this.props.onFilterControlChange(selectedValues, this.props.controlId);
    }

    
    isSelectAllChecked(){
        let checked = false;
        if (!isEmpty(this.props.currentCriterion)){
            let selected = this.props.currentCriterion.values; //["a", "b"]
            let allOptions = this.getAllOptions(); //["a", "b", "c"]
            
            let diff = differenceWith(allOptions, selected, isEqual);
            checked = isEmpty(diff);            
        }

        return checked;
    }

    createSelectAllCheckbox(){
        let checked = this.isSelectAllChecked();
        return(
            <div key={'Select All'} className='checkbox select-all'>
                <label>
                    <input 
                        type='checkbox'
                        value='selectAll'
                        checked={checked} 
                        onChange={this.onSelectAllToggle.bind(this)} />
                        Select All
                </label>
            </div>
        );
    }
    
    isChecked(checkboxConfig){
        if (!isEmpty(this.props.currentCriterion)){
            let valueFromConfig = this.props.currentCriterion.values;
            
            //In case of single value, turns it into array with one value.
            if (!Array.isArray(valueFromConfig)){
                this.props.currentCriterion.values = [];
                this.props.currentCriterion.values.push(valueFromConfig);
            }
            return (this.props.currentCriterion.values.indexOf(checkboxConfig.code) >= 0);
        }

        return false;
    }

    createCheckbox(checkboxConfig) {
            return (
                <div key={checkboxConfig.code} className='checkbox'>
                    <label>
                        <input  
                            type='checkbox'
                            value={checkboxConfig.code} 
                            checked={this.isChecked(checkboxConfig)} 
                            onChange={this.toggleCheckbox.bind(this,checkboxConfig)} />
                            {checkboxConfig.decode}
                    </label>
                </div>
            );
    }

    createCheckboxes() {
        let checkboxConfigs = this.getCheckboxConfigs();
        let checkboxes = [];

        if(!isEmpty(checkboxConfigs)){
            checkboxes = checkboxConfigs.map((checkboxConfig)=>this.createCheckbox(checkboxConfig));
        }
        return checkboxes;
    }

    render(){
        let className = 'checkbox-filter-control ' + this.props.controlId;
        let scrollClass = (this.props.config.type === 'checkBoxGroup') ? 'control-scroll' : '';

      return (
        <div className={scrollClass}>
            <div className={className}>
              {this.props.config.selectAll ? this.createSelectAllCheckbox() : ''}
              {this.createCheckboxes()}
            </div>
        </div>
      );
    }
 }

export default CheckBoxFilterControl;