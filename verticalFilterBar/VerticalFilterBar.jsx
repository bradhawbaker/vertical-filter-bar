import React from 'react';
import { composeThemeFromProps } from '@css-modules-theme/react';

import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import {PropTypes} from 'prop-types';
import FilterGroup from './FilterGroup.jsx';
import vfbStyle from '../resources/_verticalFilterBar.scss';

import buildThemingProps from '../utils/ThemeUtils';

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

  loadFilterGroup(theme){
    if(!isEmpty(this.props.filtersConfig)) {
      return (
        <FilterGroup
          ref={(filters) => this.filters = filters}
          data={this.props.data}
          filtersOrder={this.props.filtersOrder}
          filtersConfig={this.props.filtersConfig}
          filtersValues={this.state.filterValues}
          onFilterChange={this.onFilterChange.bind(this)}
          theme={theme}
        />
      )
    } else {
      let {noFilterMessage} = this.props;
      return (
        <div className={theme.vfbNofilterMessage}> {noFilterMessage} </div>
      )
    }

  }

  render(){
    const { theme, themeProps } = this.props;
    const themingProperties = buildThemingProps(theme, themeProps);
    const composedTheme = composeThemeFromProps(vfbStyle, themingProperties, { compose: 'merge', });

    return (
      <div className={composedTheme.vfbFilters}>
        <div className={composedTheme.vfbHeader}>{this.props.filterTitle}
          <div className={composedTheme.clearAll} title={this.props.clearAllToolTip}
               onClick={this.onClearAll.bind(this)}>{this.props.clearAllText}</div>
        </div>
        {this.loadFilterGroup(composedTheme)}
      </div>
    );
  }
}
export default VerticalFilterBar;
VerticalFilterBar.propTypes = {
  filterValues: PropTypes.any,
  filterTitle: PropTypes.any,
  clearAllToolTip: PropTypes.string,
  clearAllText: PropTypes.string,
  filtersConfig: PropTypes.any,
  filtersOrder: PropTypes.any,
  data:  PropTypes.any,
  onFilterChange: PropTypes.func,
  noFilterMessage:PropTypes.string,
  theme: PropTypes.object,
  themeProps: PropTypes.shape({
    prefix: PropTypes.string,
    compose: PropTypes.string
  })
}

VerticalFilterBar.defaultProps = {
  noFilterMessage: "No Filter Available",
  clearAllToolTip: FILTER_BAR_CLEAR_ALL_TOOL_TIP,
  clearAllText: FILTER_BAR_CLEAR_ALL,
  theme: {},
  themeProps: {
    prefix: "vfb-",
    compose: "merge"
  }
};
