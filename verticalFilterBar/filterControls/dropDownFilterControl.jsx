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

    if (currentCriterion && currentCriterion &&
      (!this.state.currentCriterion ||
      (currentCriterion.values.code && (!this.state.currentCriterion.values ||
      !isEqual(this.state.currentCriterion.values.code, currentCriterion.values.code)) ||
      !isEqual(currentCriterion.values, this.state.currentCriterion.values)))) {
      this.handleChange(currentCriterion.values);
    }
  }

  handleChange(value){
    let selectedValues = {};

    if (!isEmpty(value)){
      selectedValues.values = value;
    }

    this.setState({currentCriterion: selectedValues});
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
          onChange = {this.handleChange.bind(this)}
          clearAllText={clearToolTip}
          clearValueText={clearToolTip}
        >
        </Select>
      </div>
    );
  }
}

export default DropDownFilterControl;
