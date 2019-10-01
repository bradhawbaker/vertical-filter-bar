import React from 'react';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import {PropTypes} from 'prop-types';
import i18n from '../utils/i18n/i18n';
import FilterGroup from './FilterGroup.jsx';
// import '../resources/_react-select.css';
import vfbStyle from '../resources/_verticalFilterBar.scss';

import {
  FILTER_BAR_CLEAR_ALL,
  FILTER_BAR_CLEAR_ALL_TOOL_TIP
} from './VerticalFilterBarConstants';

class VerticalFilterBar extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      filterValues: {}
    };
  }


  onFilterChange(filtersValues, filterId){
    this.setState(() => {
      return {filterValues: filtersValues};
    });

    if(this.props.onFilterChange){
      this.props.onFilterChange(filtersValues, filterId);
    }
  }

  resetIsOpen(){
    return this.filters.resetIsOpen();
  }

  onClearAll(){
    let clearedFilterValues = {};

    for (let filterValue in this.state.filterValues) {
      let emptyFilterValue = {};
      let filterControlId = Object.keys(this.props.filtersConfig[filterValue]['controls'])[0];
      let controller = {};
      controller.values = emptyFilterValue;
      let controllers = {};
      controllers[filterControlId] = controller;
      let controls = {};
      controls.controls = controllers;
      clearedFilterValues[filterValue] = controls;
    }
    this.setState(() => {
      return {filterValues: clearedFilterValues};
    });
  }

  componentWillMount() {
    if (!isEmpty(this.props.filterValues)) {
      this.setState({filterValues: this.props.filterValues});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.filterValues, this.props.filterValues)) {
      this.setState({filterValues: nextProps.filterValues});
    }
  }

  loadFilterGroup(){
    if(!isEmpty(this.props.filtersConfig)) {
      return (
        <FilterGroup
          ref={(filters) => this.filters = filters}
          data={this.props.data}
          filtersOrder={this.props.filtersOrder}
          filtersConfig={this.props.filtersConfig}
          filtersValues={this.state.filterValues}
          onFilterChange={this.onFilterChange.bind(this)}
        />
      )
    } else {
      let {noFilterMessage} = this.props;
      return (
        <div className={vfbStyle.vfbNofilterMessage}> {noFilterMessage} </div>
      )
    }

  }

  render(){
    return (
      <div className={vfbStyle.vfbFilters}>
        <div className={vfbStyle.vfbHeader}>{this.props.filterTitle}
          <div className={vfbStyle.clearAll} title={i18n(FILTER_BAR_CLEAR_ALL_TOOL_TIP)}
               onClick={this.onClearAll.bind(this)}>{i18n(FILTER_BAR_CLEAR_ALL)}</div>
        </div>
        {this.loadFilterGroup()}
      </div>
    );
  }
}
export default VerticalFilterBar;
VerticalFilterBar.propTypes = {
  filterValues: PropTypes.any,
    filterTitle: PropTypes.any,
    filtersConfig: PropTypes.any,
    filtersOrder: PropTypes.any,
    data:  PropTypes.any,
    onFilterChange: PropTypes.func,
    noFilterMessage:PropTypes.string
}

VerticalFilterBar.defaultProps = {
  noFilterMessage: "No Filter Available"
};
