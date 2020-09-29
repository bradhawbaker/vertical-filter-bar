import React from 'react';

import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import Select from 'react-select';
import FilterControl from './filterControl';

import '../../external/_react-select.css'

class DropDownFilterControl extends FilterControl{

  constructor(props) {
    super(props);
    this.state = {
      currentCriterion: {}
    };
  }

  componentWillMount() {
    if (this.props.currentCriterion && this.props.currentCriterion.values) {
      this.handleChange(this.props.currentCriterion.values);
    }
  }

  componentDidUpdate() {
    let {currentCriterion} = this.props;

    if (currentCriterion && currentCriterion.values) {
      // we have a value to set
      if (Object.keys(currentCriterion.values).length > 0) {
        // a value is set, check if it is different from what was previously set
        if (!this.state.currentCriterion || !this.state.currentCriterion.values) {
          // there was no value previously
          this.updateFilterValuesFromParent(currentCriterion.values);
        } else if (currentCriterion.values.code && this.state.currentCriterion.values.code && 
          !isEqual(this.state.currentCriterion.values.code, currentCriterion.values.code)) {
            // the code values are different
            this.updateFilterValuesFromParent(currentCriterion.values);
        } else if (this.state.currentCriterion.values && !isEqual(currentCriterion.values, this.state.currentCriterion.values)) {
          // the values are different
          this.updateFilterValuesFromParent(currentCriterion.values);
        }
      } else {
        // no value set, check if there was one previously
        if (this.state.currentCriterion.values) {
          // there was reviously a value
          this.updateFilterValuesFromParent(currentCriterion.values);
        } else if (this.state.currentCriterion.values && this.state.currentCriterion.values.code) {
          this.updateFilterValuesFromParent(currentCriterion.values);
        }
      }
    } else {
      // there is no value to set, see if there was previously
      if (this.state.currentCriterion.values) {
        // there was reviously a value
        this.updateFilterValuesFromParent({});
      } else if (this.state.currentCriterion.values && this.state.currentCriterion.values.code) {
        this.updateFilterValuesFromParent({});
      }
    }
  }

  updateFilterValuesFromParent(value) {
    let selectedValues = {};

    if (!isEmpty(value)){
      selectedValues.values = value;
    }

    this.setState({currentCriterion: selectedValues});
  }

  handleSelectionChange(value){
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

    if (!isEmpty(this.state.currentCriterion)){
      selectedValues = [];
      let configValue = this.state.currentCriterion.values;
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
    const {theme} = this.props;
    let multiSelect = ( this.props.config.multiSelect === true);
    const clearToolTip = this.props.config.clearToolTip;
    let dropdownValue = this.getSelectValues();

    if (!isEmpty(dropdownValue) && !multiSelect){
      dropdownValue = dropdownValue[0];
    }

    let searchable = (typeof this.props.config.searchable === 'undefined') ? true : this.props.config.searchable;
    let className = `${theme.dropdownFilterControl} ${this.props.controlId}`;
    return (
      <div className={className} >
        <div className={theme.label}>{this.props.config.label}</div>
        <Select
          multi={multiSelect}
          placeholder = {this.props.config.watermark}
          value={dropdownValue}
          labelKey = 'decode'
          valueKey = 'code'
          searchable = {searchable}
          options = {this.getSelectOptions()}
          onChange = {this.handleSelectionChange.bind(this)}
          clearAllText={clearToolTip}
          clearValueText={clearToolTip}
        >
        </Select>
      </div>
    );
  }
}

export default DropDownFilterControl;
