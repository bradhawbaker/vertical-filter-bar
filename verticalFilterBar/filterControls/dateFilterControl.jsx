import React from 'react';
import isEqual from 'lodash/isEqual';

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

  constructor(props) {
    super(props);
    this.state = {
      currentCriterion: {}
    };
  }

  componentDidMount() {
    if (this.props.currentCriterion && this.props.currentCriterion.values) {
      this.onSelect(this.props.currentCriterion.values);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentCriterion && nextProps.currentCriterion.values &&
      (!this.state.currentCriterion ||
      (nextProps.currentCriterion.values.code && (!this.state.currentCriterion.values ||
      !isEqual(this.state.currentCriterion.values.code, nextProps.currentCriterion.values.code)) ||
      (!isEmpty(this.state.currentCriterion.values) && isEmpty(nextProps.currentCriterion.values)) ||
      (!isEmpty(nextProps.currentCriterion.values) && isEmpty(this.state.currentCriterion.values))))) {
      this.onSelect(nextProps.currentCriterion.values);
    } else if (nextProps.currentCriterion && nextProps.currentCriterion.values &&
      nextProps.currentCriterion.values.code === 'custom_range' &&
      ((nextProps.currentCriterion.values.to && (!this.state.currentCriterion.values ||
      !isEqual(this.state.currentCriterion.values.to, nextProps.currentCriterion.values.to))) ||
      (nextProps.currentCriterion.values.from && (!this.state.currentCriterion.values ||
      !isEqual(this.state.currentCriterion.values.from, nextProps.currentCriterion.values.from))))) {
      this.onSelect(nextProps.currentCriterion.values);
    }
  }

  onSelect(selected){
    let selectedValues = {};
    if (!isEmpty(selected)){
      let description = selected.code;

      if (description === 'custom_range'){
        selectedValues.values = {
          'from': (selected.from || null),
          'to': (selected.to || null),
          'code': description
        };
      }
      else{
        let selectedDates = this.getDatesFromDescription(description);
        selectedValues.values = {
          'from': selectedDates.from,
          'to': selectedDates.to,
          'code': description
        };
      }
    }

    this.setState({currentCriterion: selectedValues});
    this.props.onFilterControlChange(selectedValues, this.props.controlId);
  }

  onDatePickerChange(fromTo, selectedDate){
    let selectedValues = {};
    selectedValues.values = {
      'from': null ,
      'to': null,
      'code': 'custom_range'
    };

    if (selectedDate.isValid()){
      let fromValue = this.state.currentCriterion.values.from;
      let toValue = this.state.currentCriterion.values.to;
      if (fromTo === 'from'){
        let startOfDay = selectedDate.toDate();
        startOfDay.setHours(0, 0, 0, 0);
        fromValue = startOfDay;
      }
      else{
        let endOfDay = selectedDate.toDate();
        endOfDay.setHours(23, 59, 59, 999);
        toValue = endOfDay;
      }

      if (!isEmpty(selectedDate)){
        let description = 'custom_range';

        selectedValues.values = {
          'from': fromValue,
          'to': toValue,
          'code': description
        };
      }
    }

    this.setState({currentCriterion: selectedValues});
    this.props.onFilterControlChange(selectedValues, this.props.controlId);
  }

  getDateDropDown(){
    let multiSelect = (this.props.config.multiSelect === true);
    let dropdownValue = !isEmpty(this.state.currentCriterion) ? this.state.currentCriterion.values.code : null;

    return (
      <div className='dropdown-filter-control' >
        <Select
          className = 'dropdown-select date-dropdown'
          multi={multiSelect}
          placeholder = {i18n(this.props.config.watermark)}
          value={dropdownValue}
          labelKey = 'decode'
          valueKey = 'code'
          options = {this.getSelectOptions()}
          onChange = {this.onSelect.bind(this)}
          optionGroups = {true}
        >
        </Select>
      </div> );
  }

  getDatePicker(){
    if (isEmpty(this.state.currentCriterion)){
      return;
    }

    let currentValue = this.state.currentCriterion.values;

    if (!isEmpty(currentValue)){
      if (currentValue.code === 'custom_range'){
        let startDate = moment(currentValue.from).isValid() ? moment(currentValue.from) : currentValue.from;
        let endDate = moment(currentValue.to).isValid() ? moment(currentValue.to) : currentValue.to;
        let className = 'date-picker-filter-control ' + this.props.controlId;
        let dateFormat = 'YYYY-MM-DD';

        if (this.props.config.format) {
          dateFormat = this.props.config.format;
        }

        return (
          <div>
            <div className={className}>
              <div>{i18n(DatePickerLabelFrom)}</div>
              <DatePicker
                key='startDate'
                filterDate={this.excludeStartDates.bind(this, endDate)}
                dateFormat={dateFormat}
                placeholderText={i18n(DatePickerPlaceholderAllDates)}
                selected={startDate}
                onChange={this.onDatePickerChange.bind(this, 'from')}/>
            </div>
            <div className={className}>
              <div>{i18n(DatePickerLabelTo)}</div>
              <DatePicker
                key='endDate'
                filterDate={this.excludeEndDates.bind(this, startDate)}
                dateFormat={dateFormat}
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

  calculateLastDates(interval, unit) {
    let dates = {};
    let fromDate = new Date();
    let toDate = new Date();
    let today = new Date();

    switch(unit) {
      case 'hours':
        toDate.setDate(today.getDate());
        fromDate.setDate(today.getDate());
        fromDate.setHours(today.getHours() - interval);
        break;
      case 'days':
        toDate.setDate(today.getDate());
        toDate.setHours(23, 59, 59, 999);
        fromDate.setDate(today.getDate() - interval);
        fromDate.setHours(0, 0, 0, 0);
        break;
      case 'weeks':
        toDate.setDate(today.getDate());
        toDate.setHours(23, 59, 59, 999);
        fromDate.setDate(today.getDate() - (7 * interval));
        fromDate.setHours(0, 0, 0, 0);
        break;
      case 'months':
        toDate.setDate(today.getDate());
        toDate.setHours(23, 59, 59, 999);
        fromDate.setDate(today.getDate());
        fromDate.setMonth(today.getMonth() - interval);
        fromDate.setHours(0, 0, 0, 0);
        break;
      case 'years':
        toDate.setDate(today.getDate());
        toDate.setHours(23, 59, 59, 999);
        fromDate.setDate(today.getDate());
        fromDate.setFullYear(today.getFullYear() - interval);
        fromDate.setHours(0, 0, 0, 0);
        break;
    }

    dates.from = fromDate;
    dates.to = toDate;

    return dates;
  }

  calculateNextDates(interval, unit) {
    let dates = {};
    let fromDate = new Date();
    let toDate = new Date();
    let today = new Date();

    switch(unit) {
      case 'hours':
        fromDate.setDate(today.getDate());
        toDate.setDate(today.getDate());
        toDate.setHours(today.getHours() + interval);
        break;
      case 'days':
        fromDate.setDate(today.getDate());
        fromDate.setHours(0, 0, 0, 0);
        toDate.setDate(today.getDate() + interval);
        toDate.setHours(23, 59, 59, 999);
        break;
      case 'weeks':
        fromDate.setDate(today.getDate());
        fromDate.setHours(0, 0, 0, 0);
        toDate.setDate(today.getDate() + (7 * interval));
        toDate.setHours(23, 59, 59, 999);
        break;
      case 'months':
        fromDate.setDate(today.getDate());
        fromDate.setHours(0, 0, 0, 0);
        toDate.setDate(today.getDate());
        toDate.setMonth(today.getMonth() + interval);
        toDate.setHours(23, 59, 59, 999);
        break;
      case 'years':
        fromDate.setDate(today.getDate());
        fromDate.setHours(0, 0, 0, 0);
        toDate.setDate(today.getDate());
        toDate.setFullYear(today.getFullYear() - interval);
        toDate.setHours(23, 59, 59, 999);
        break;
    }

    dates.from = fromDate;
    dates.to = toDate;

    return dates;
  }

  getDatesFromDescription(description){
    let dates = {};

    let parsedDatesArray = description.split('_');

    if (parsedDatesArray[1] === '0') {
      // interval is 0, assume today (0:00:00 to 23:59:59)
      let fromDate = new Date();
      let toDate = new Date();
      let today = new Date();
      toDate.setDate(today.getDate());
      toDate.setHours(23, 59, 59, 999);
      fromDate.setDate(today.getDate());
      fromDate.setHours(0, 0, 0, 0);
      dates.from = fromDate;
      dates.to = toDate;
    } else if (parsedDatesArray[0] === 'last') {
      dates = this.calculateLastDates(parsedDatesArray[1], parsedDatesArray[2]);
    } else if (parsedDatesArray[0] === 'next') {
      dates = this.calculateNextDates(parsedDatesArray[1], parsedDatesArray[2]);
    }

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
      configOptions = [{decode:i18n(DatesDropDownOptionsCustomRange), code:'custom_range'},
        {decode: i18n(DatesDropDownOptionsLast), code:'Last',disabled:true},
        {decode: i18n(DatesDropDownOptionsLast24Hours), code:'Last_24_hours'},
        {decode: i18n(DatesDropDownOptionsLast2Days), code:'Last_2-days'},
        {decode: i18n(DatesDropDownOptionsLast3Days), code:'Last_3_days'},
        {decode: i18n(DatesDropDownOptionsLast4Days), code:'Last_4_days'},
        {decode: i18n(DatesDropDownOptionsLast5Days), code:'Last_5_days'},
        {decode: i18n(DatesDropDownOptionsNext), code:'Next',disabled:true},
        {decode: i18n(DatesDropDownOptionsNext24Hours), code:'Next_24_hours'},
        {decode: i18n(DatesDropDownOptionsNext2Days), code:'Next_2_days'},
        {decode: i18n(DatesDropDownOptionsNext3Days), code:'Next_3_days'},
        {decode: i18n(DatesDropDownOptionsNext4Days), code:'Next_4_days'},
        {decode: i18n(DatesDropDownOptionsNext5Days), code:'Next_5_days'} ];
    }

    return configOptions;
  }

  render(){
    return (
      <div>
        {this.getDateDropDown(this.state.currentCriterion)}
        {this.getDatePicker(this.state.currentCriterion)}
      </div>
    );
  }
}
export default DateFilterControl;
