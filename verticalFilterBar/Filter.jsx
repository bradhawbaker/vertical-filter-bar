import React from 'react';
import {VelocityTransitionGroup} from 'velocity-react';
import { PropTypes } from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isUndefined from 'lodash/isUndefined';
import getFilterControlType from './filterControls/filterControlTypeFactory';
import {
  FILTER_TOOLTIP_CLEAR_ICON,
  SHOW_FILTER,
  HIDE_FILTER
} from './VerticalFilterBarConstants';

class Filter extends React.Component{



  constructor(props){
    super(props);
    this.state = {
      isOpen: undefined,
      filterControlsValues: {}
    };
  }
  static get propTypes() {
    return {
      filterControlsValues: PropTypes.any,
      filterControlsConfig: PropTypes.any,
      onFilterChange: PropTypes.func,
      filterId: PropTypes.any,
      data:PropTypes.any,
      isDisabled: PropTypes.any,
      theme: PropTypes.object
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
          this.onFilterControlChange({}, controlId);
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
          let element = {'code': option.code, 'decode': option.decode};
          configOptions.push(element);
        });
      }
    }

    return configOptions;
  }

  createFilterControls(){
    const {theme} = this.props;
    let filtersConfig = this.props.filterControlsConfig;
    let filterControlsIds = Object.keys(filtersConfig.controls);
    let filterControls = [];
    for(var i = 0; i < filterControlsIds.length; i++){
      let filterControlId = filterControlsIds[i];
      var config = filtersConfig.controls[filterControlId];
      let FilterControlType = getFilterControlType(config);
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
            theme={theme}
          />
        );
      }
    }
    return filterControls;
  }

  createFilterHeader(){
    const {theme} = this.props;
    const {
      hideHeader,
      label,
      showToolTip=SHOW_FILTER,
      hideToolTip=HIDE_FILTER,
      clearToolTip=FILTER_TOOLTIP_CLEAR_ICON
    } = this.props.filterControlsConfig;
    if(hideHeader === true){
      return null;
    }

    return(
      <div onClick={this.onFilterHeaderClick.bind(this)}className={theme.filterHeader}>
        <div className={theme.title} title={label}>{label}
          {!this.areControlsWithValues(this.getFilterControlsValues()) || this.props.isDisabled ? '' :
            <div className={theme.iconClickArea} title = {clearToolTip}
                 onClick={this.onFilterIconClick.bind(this)}>
              <div className={theme.icon}></div>
            </div>
          }
        </div>
        {this.props.isDisabled ? '' :
          <div className={theme.direction}
               title={this.isOpen() ? hideToolTip : showToolTip}></div>
        }
      </div>
    );
  }

  render(){
    const {theme} = this.props;
    let filterControls = this.createFilterControls();
    let dopFilterClassName = `${theme.filter} ${this.props.filterId}`;
    dopFilterClassName = this.props.isDisabled ? `${dopFilterClassName} ${theme.disabled}` : dopFilterClassName;
    let isOpen = this.isOpen();
    let filterDirectionClassName = isOpen ? theme.expand : theme.collapse;
    return (
      <div className={`${dopFilterClassName} ${filterDirectionClassName}`}>
        {this.createFilterHeader()}
        <VelocityTransitionGroup component='div' enter='slideDown' leave='slideUp'>
          {isOpen ? <div className={theme.controls}>{filterControls}</div> :
            <div className={theme.hiddenFilter}>{filterControls}</div> }
        </VelocityTransitionGroup>
      </div>
    );
  }
}

export default Filter;
