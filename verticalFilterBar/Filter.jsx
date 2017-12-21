import React from 'react';
import isEmpty from 'lodash.isEmpty';
import isEqual from 'lodash.isEqual';
import isUndefined from 'lodash.isUndefined';
import {VelocityTransitionGroup} from 'velocity-react';

import * as FilterCotrolTypeFactory from './filterControls/filterControlTypeFactory';
import i18n from '../utils/i18n/i18n.js';
import {
  FILTER_TOOLTIP_CLEAR_ICON,
  SHOW_FILTER,
  HIDE_FILTER
} from './VerticalFilterBarConstants.js';

class Filter extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      isOpen: undefined,
      filterControlsValues: {}
    };
  }

  componentWillMount() {
    if (!isEmpty(this.props.filterControlsValues)) {
      this.setState({
        isOpen: true,
        filterControlsValues: this.props.filterControlsValues
      });
    }
  }

  componentWillReceiveProps(nextProps){
    if (!isEqual(this.props.filterControlsValues, nextProps.filterControlsValues)) {
      let isOpen = this.areControlsWithValues(nextProps.filterControlsValues);
      this.setState({
        isOpen: isOpen,
        filterControlsValues: nextProps.filterControlsValues
      });
    }
  }

  areControlsWithValues(filterControlsValues){
    let haveValues = false;
    if (!isEmpty(filterControlsValues)){
      for (let control in filterControlsValues){
        if (!isEmpty(filterControlsValues[control].values)){
          haveValues = true;
          break;
        }
      }
    }
    return haveValues;
  }

  isOpen(){
    if(this.props.filterControlsConfig.hideHeader === true){
      return true;
    }
    else if(!isUndefined(this.state.isOpen)){
      return this.state.isOpen;
    }
    else if(!isEmpty(this.state.filterControlsValues)){
      return this.areControlsWithValues(this.state.filterControlsValues);
    }
    return false;
  }

  getControlValues(filterControlId){
    if (!isUndefined(this.state.filterControlsValues[filterControlId])){
      let filterControlsValues = this.state.filterControlsValues[filterControlId];
      return filterControlsValues;
    }
  }

  getFilterControlsValues(){
    if (!isUndefined(this.state.filterControlsValues)){
      let filterControlsValues = this.state.filterControlsValues;
      return filterControlsValues;
    }
  }

  onFilterControlChange(filterControlValues, filterControlId){
    let filterValues = {};
    let filterControlsValues = this.getFilterControlsValues();

    // change or add control
    if (!isEmpty(filterControlValues)){
      filterControlsValues[filterControlId] = filterControlValues;
    }
    // delete control
    else{
      if (!isEmpty(filterControlsValues[filterControlId])){
        delete filterControlsValues[filterControlId];
      }
      // delete all controls
      if (isUndefined(filterControlId)){
        filterControlsValues = {};
      }
    }

    if (!isEmpty(filterControlsValues)){
      filterValues['controls'] = filterControlsValues;
    }
    this.props.onFilterChange(filterValues, this.props.filterId);
  }

  onFilterIconClick(event){
    event.stopPropagation();
    this.clear();
  }

  clear(){
    let clearedFilterControlsValues = {};

    if (!isEmpty(this.state.filterControlsValues)) {
      for (let controlId in this.props.filterControlsConfig.controls) {
        if (!isEmpty(this.state.filterControlsValues[controlId]) &&
          !isEmpty(this.state.filterControlsValues[controlId].values)) {
          let emptyValues = {};
          let emptyControler = {};
          emptyControler['values'] = emptyValues;
          clearedFilterControlsValues[controlId] = emptyControler;
        }
      }
    }

    this.setState({filterControlsValues: clearedFilterControlsValues});
  }

  onFilterHeaderClick(){
    this.setState({isOpen: !this.state.isOpen});
  }

  getDynamicOptions(filterConfig){
    let configOptions;
    let dynamicOptions = filterConfig.dynamicOptions;

    if(!isEmpty(dynamicOptions) && !isEmpty (this.props.data)){
      if (!isEmpty(this.props.data.enums)){
        configOptions = this.props.data.enums[dynamicOptions];
      }
      if (isEmpty(configOptions) && !isEmpty (this.props.data.custom)){
        configOptions = this.props.data.custom[dynamicOptions];
      }
    }

    else {
      let nonDynamicOptions = filterConfig.options;
      if (!isEmpty(nonDynamicOptions)){
        configOptions = [];
        nonDynamicOptions.forEach((option)=>{
          let element = {'code': option.code, 'decode': i18n(option.decode)};
          configOptions.push(element);
        });
      }
    }

    return configOptions;
  }

  createFilterControls(){
    let filtersConfig = this.props.filterControlsConfig;
    let filterControlsIds = Object.keys(filtersConfig.controls);
    let filterControls = [];
    for(var i = 0; i < filterControlsIds.length; i++){
      let filterControlId = filterControlsIds[i];
      var config = filtersConfig.controls[filterControlId];
      let FilterControlType = FilterCotrolTypeFactory.getFilterControlType(config);
      let currentCriterion = this.getControlValues(filterControlId);
      let dynamicOptions = this.getDynamicOptions(config);
      if (!this.props.isDisabled){
        filterControls.push(
          <FilterControlType
            key={filterControlId}
            controlId={filterControlId}
            onFilterControlChange={this.onFilterControlChange.bind(this)}
            currentCriterion={currentCriterion}
            data={this.props.data}
            config={config}
            dynamicOptions={dynamicOptions}
          />
        );
      }
    }
    return filterControls;
  }

  createFilterHeader(){
    let hideHeader = this.props.filterControlsConfig.hideHeader;
    if(hideHeader === true){
      return null;
    }

    let label = i18n(this.props.filterControlsConfig.label);
    return(
      <div onClick={this.onFilterHeaderClick.bind(this)}className='filter-header'>
        <div className='title' title={label}>{label}
          {!this.areControlsWithValues(this.getFilterControlsValues()) || this.props.isDisabled ? '' :
            <div className='iconClickArea' title = {i18n(FILTER_TOOLTIP_CLEAR_ICON)} onClick={this.onFilterIconClick.bind(this)}>
              <div className='icon'></div>
            </div>
          }
        </div>
        {this.props.isDisabled ? '' :
          <div className='direction' title={this.isOpen() ? i18n(HIDE_FILTER) : i18n(SHOW_FILTER)}></div>
        }
      </div>
    );
  }

  render(){
    let filterControls = this.createFilterControls();
    let dopFilterClassName = 'filter ' + this.props.filterId;
    dopFilterClassName = this.props.isDisabled ? (dopFilterClassName + ' disabled') : dopFilterClassName;
    let isOpen = this.isOpen();
    let filterDirectionClassName = isOpen ? 'expand' : 'collapse';
    return (
      <div className={dopFilterClassName + ' ' + filterDirectionClassName}>
        {this.createFilterHeader()}
        <VelocityTransitionGroup component='div' enter='slideDown' leave='slideUp'>
          {isOpen ? <div className='controls'>{filterControls}</div> : <div className='hiddenFilter'>{filterControls}</div> }
        </VelocityTransitionGroup>
      </div>
    );
  }
}

export default Filter;
