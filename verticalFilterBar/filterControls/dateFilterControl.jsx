import React from 'react';
import FilterControl from './filterControl';
import Select from 'react-select';
import isEmpty from 'lodash/isEmpty';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import i18n from '../../utils/i18n/i18n.js';

import {
  DatesDropDownOptionsCustomRange,
  DatesDropDownOptionsLast,
  DatesDropDownOptionsLast24Hours,
  DatesDropDownOptionsLast2Days,
  DatesDropDownOptionsLast3Days,
  DatesDropDownOptionsLast4Days,
  DatesDropDownOptionsLast5Days,
  DatesDropDownOptionsNext,
  DatesDropDownOptionsNext24Hours,
  DatesDropDownOptionsNext2Days,
  DatesDropDownOptionsNext3Days,
  DatesDropDownOptionsNext4Days,
  DatesDropDownOptionsNext5Days,
  DatePickerLabelFrom,
  DatePickerLabelTo,
  DatePickerPlaceholderAllDates
} from '../VerticalFilterBarConstants.js';

class DateFilterControl extends FilterControl{

  onSelect(selected){
    let selectedValues = {};
    if (!isEmpty(selected)){
      let description = selected.code;

      if (description === 'Custom Range'){
        selectedValues.values = {
          'from': null ,
          'to': null,
          'description': description
        };
      }
      else{
        let selectedDates = this.getDatesFromDescription(description);
        selectedValues.values = {
          'from': selectedDates.from,
          'to': selectedDates.to,
          'description': description
        };
      }
    }

    this.props.onFilterControlChange(selectedValues, this.props.controlId);

  }

  onDatePickerChange(fromTo, selectedDate){
    let selectedValues = {};
    selectedValues.values = {
      'from': null ,
      'to': null,
      'description': 'Custom Range'
    };

    if (selectedDate.isValid()){
      let fromValue = this.props.currentCriterion.values.from;
      let toValue = this.props.currentCriterion.values.to;
      if (fromTo === 'from'){
        fromValue = selectedDate.toISOString();
      }
      else{
        toValue = selectedDate.toISOString();
      }

      if (!isEmpty(selectedDate)){
        let description = 'Custom Range';

        selectedValues.values = {
          'from': fromValue,
          'to': toValue,
          'description': description
        };
      }
    }

    this.props.onFilterControlChange(selectedValues, this.props.controlId);
  }

  getDateDropDown(){
    let multiSelect = (this.props.config.multiSelect === true);
    let dropdownValue = !isEmpty(this.props.currentCriterion) ? this.props.currentCriterion.values.description : null;

    return (
      <div className='dropdown-filter-control' >
        <Select
          className = 'dropdown-select date-dropdown'
          multi={multiSelect}
          placeholder = {i18n(this.props.config.watermark)}
          value={dropdownValue}
          valueRenderer = {this.getSelectValue.bind(this, dropdownValue)}
          labelKey = 'decode'
          valueKey = 'code'
          options = {this.getSelectOptions()}
          onChange = {this.onSelect.bind(this)}
          optionGroups = {true}
        >
        </Select>
      </div> );
  }

  getSelectValue(dropdownValue){
    return dropdownValue;
  }

  getDatePicker(){

    if (isEmpty(this.props.currentCriterion)){
      return;
    }

    let currentValue = this.props.currentCriterion.values;

    if (!isEmpty(currentValue)){
      if (currentValue.description === 'Custom Range'){
        let startDate = moment(currentValue.from).isValid() ? moment(currentValue.from) : currentValue.from;
        let endDate = moment(currentValue.to).isValid() ? moment(currentValue.to) : currentValue.to;
        let className = 'date-picker-filter-control ' + this.props.controlId;

        return (
          <div>
            <div className={className}>
              <div>{i18n(DatePickerLabelFrom)}</div>
              <DatePicker
                key='startDate'
                filterDate={this.excludeStartDates.bind(this, endDate)}
                dateFormat='DD/MM/YYYY'
                placeholderText={i18n(DatePickerPlaceholderAllDates)}
                selected={startDate}
                onChange={this.onDatePickerChange.bind(this, 'from')} />
            </div>
            <div className={className}>
              <div>{i18n(DatePickerLabelTo)}</div>
              <DatePicker
                key='endDate'
                filterDate={this.excludeEndDates.bind(this, startDate)}
                dateFormat='DD/MM/YYYY'
                placeholderText={i18n(DatePickerPlaceholderAllDates)}
                selected={endDate}
                openToDate={startDate}
                onChange={this.onDatePickerChange.bind(this, 'to')} />
            </div>
          </div>
        );
      }
    }
  }

  excludeEndDates(startDate, date){
    if(date <= startDate){
      return false;
    }
    return true;
  }

  excludeStartDates(endDate, date){
    if (!isEmpty(endDate) && date >= endDate){
      return false;
    }

    return true;
  }

  getDatesFromDescription(description){
    let dates = {};
    let numberPattern = /\d+/g;
    let offSet = description.match(numberPattern);
    offSet = parseInt(offSet);
    if(offSet === 24){
      offSet = 1;
    }
    let fromDate = new Date();
    let toDate = new Date();
    let today = new Date();
    if(description.indexOf('Last') !== -1){
      toDate.setDate(today.getDate());
      fromDate.setDate(today.getDate() - offSet);
    }
    else if(description.indexOf('Next') !== -1){
      fromDate.setDate(today.getDate());
      toDate.setDate(today.getDate() + offSet);
    }
    dates.from = fromDate;
    dates.to = toDate;

    return dates;
  }

  get(data, dynamicOptions) {
    return dynamicOptions;
  }

  getSelectOptions (){
    let configOptions;
    if(!isEmpty(this.props.config.dynamicOptions)){
      configOptions = this.get(this.props.data,this.props.config.dynamicOptions);
    } else{
      configOptions = [{decode:i18n(DatesDropDownOptionsCustomRange), code:'Custom Range'},
        {decode: i18n(DatesDropDownOptionsLast), code:'Last',disabled:true},
        {decode: i18n(DatesDropDownOptionsLast24Hours), code:'Last 24 hours'},
        {decode: i18n(DatesDropDownOptionsLast2Days), code:'Last 2 days'},
        {decode: i18n(DatesDropDownOptionsLast3Days), code:'Last 3 days'},
        {decode: i18n(DatesDropDownOptionsLast4Days), code:'Last 4 days'},
        {decode: i18n(DatesDropDownOptionsLast5Days), code:'Last 5 days'},
        {decode: i18n(DatesDropDownOptionsNext), code:'Next',disabled:true},
        {decode: i18n(DatesDropDownOptionsNext24Hours), code:'Next 24 hours'},
        {decode: i18n(DatesDropDownOptionsNext2Days), code:'Next 2 days'},
        {decode: i18n(DatesDropDownOptionsNext3Days), code:'Next 3 days'},
        {decode: i18n(DatesDropDownOptionsNext4Days), code:'Next 4 days'},
        {decode: i18n(DatesDropDownOptionsNext5Days), code:'Next 5 days'} ];
    }

    return configOptions;
  }

  render(){
    return (
      <div>
        {this.getDateDropDown(this.props.currentCriterion)}
        {this.getDatePicker(this.props.currentCriterion)}
      </div>
    );
  }
}
export default DateFilterControl;
