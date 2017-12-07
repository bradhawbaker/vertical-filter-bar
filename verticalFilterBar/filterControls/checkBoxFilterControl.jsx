import React from 'react';
import FilterControl from './filterControl';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
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