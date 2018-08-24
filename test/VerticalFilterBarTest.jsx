import React, {Component} from 'react';
import isEmpty from 'lodash/isEmpty';

import VerticalFilterBar from '../verticalFilterBar/VerticalFilterBar.jsx';

const FILTER_TITLE = 'FILTER BY';
const dataIntegrityFilterConfiguration = {
  filters: {
    severity:{ // Severity Filter
      label:'Severity',
      controls:{
        severityControl:{
          type:'dropDown',
          multiSelect: false,
          watermark: 'Any Severity',
          defaultValue: {decode:'MAJOR',code:'MAJOR'},
          options:[
            {decode:'CRITICAL',code:'CRITICAL'},
            {decode:'MAJOR',code:'MAJOR'},
            {decode:'MINOR',code:'MINOR'}
          ],
        }
      }
    },
    category:{ // Category Filter
      label:'Category',
      controls : {
        categoryControl :{
          type : 'dropDown',
          multiSelect: true,
          watermark: 'Any Category',
          options:[
            {decode:'INVALID_NAME',code:'INVALID_NAME'},
            {decode:'INVALID_VALUE',code:'INVALID_VALUE'},
            {decode:'MISSING_VALUE',code:'MISSING_VALUE'},
            {decode:'LINK_ERROR',code:'LINK_ERROR'}
          ],
        }
      }
    },
    objectType:{  // Entity Type Filter
      label:'Object Type',
      controls : {
        typeControl :{
          type : 'dropDown',
          multiSelect: false,
          watermark: 'Any Object Type',
          options:[
            {decode:'complex',code:'complex1'},
            {decode:'connector',code:'connector'},
            {decode:'customer',code:'customer'},
            {decode:'l3-network',code:'l3-network'}
          ],
        }
      }
    },
    dateRange:{  // Date Range Filter
      label:'Date Range',
      controls : {
        dateControl :{
          type : 'date',
          multiSelect: false,
          watermark: 'Choose Date Range',
          format: 'YYYY/MM/DD',
          defaultValue: {decode:'Today',code:'last_0_hours'},
          dynamicOptions:[
            {decode:'Today',code:'last_0_hours'},
            {decode:'Since Yesterday',code:'last_1_days'},
            {decode:'Since Last Week',code:'last_1_weeks'},
            {decode:'Since Last Month',code:'last_1_months'},
            {decode:'Since Last Year',code:'last_1_years'},
            {decode:'Custom Range',code:'custom_range'}
          ],
        }
      }
    }
  }
};

export default class VerticalFilterBarTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterValues: {}
    };
    this.onFilter = this.onFilter.bind(this);
  }

  getDefaultFilterValues(filterConfig) {
    let defaultValues = {};

    for (let filterId in filterConfig) {
      let filter = {};
      let controllers = {};
      for (let filterControlerId in filterConfig[filterId]['controls']) {
        let controller = filterConfig[filterId]['controls'][filterControlerId];
        let cloneController = {};
        if (controller.defaultValue) {
          cloneController.values = controller.defaultValue;
          controllers[filterControlerId] = cloneController;
        }
      }

      if (!isEmpty(controllers)) {
        filter.controls = controllers;
        defaultValues[filterId] = filter;
      }
    }

    return defaultValues;
  }

  componentWillMount() {
    let defaultValues = this.getDefaultFilterValues(dataIntegrityFilterConfiguration.filters);
    if (Object.keys(defaultValues).length > 0) {
      this.onFilter(defaultValues);
    }
  }

  onFilter(filterValues) {
    this.setState({filterValues: filterValues});
  }

  getFilterDefault(filterId) {
    let filterControlId = Object.keys(dataIntegrityFilterConfiguration['filters'][filterId]['controls'])[0];
    let defaultValue =
      dataIntegrityFilterConfiguration['filters'][filterId]['controls'][filterControlId]['defaultValue'];
    if (!defaultValue) {
      defaultValue = {};
    }
    return defaultValue;
  }

  onClearAll() {
    let clearedFilterValues = {};

    for (let filterId in dataIntegrityFilterConfiguration['filters']) {
      let filterDefaultValue = this.getFilterDefault(filterId);
      if (!isEmpty(filterDefaultValue) || this.state.filterValues[filterId]) {
        let filterControlId = Object.keys(dataIntegrityFilterConfiguration['filters'][filterId]['controls'])[0];
        let controller = {};
        controller.values = filterDefaultValue;
        let controllers = {};
        controllers[filterControlId] = controller;
        let controls = {};
        controls.controls = controllers;
        clearedFilterValues[filterId] = controls;
      }
    }

    this.onFilter(clearedFilterValues);
  }

  render() {
    let selectedValues = JSON.stringify(this.state.filterValues);

    return (
      <div>
        <h1>Vertical Filter Bar Test</h1>
        <div className='filter-bar-div'>
          <VerticalFilterBar
            filtersConfig={dataIntegrityFilterConfiguration.filters}
            filterValues={this.state.filterValues}
            onFilterChange={this.onFilter}
            filterTitle={FILTER_TITLE}
          />
        </div>
        <div className='filter-results-div'>
          <div className='clear-all' title='REST' onClick={this.onClearAll.bind(this)}>Click HERE to reset filters to defaults</div>
          <h2>Selected Filters</h2>
          <p>{selectedValues}</p>
        </div>
      </div>
    );
  }
}
