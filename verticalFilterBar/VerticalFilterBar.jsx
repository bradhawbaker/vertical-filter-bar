/*
 * Copyright © 2016-2017 European Support Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import i18n from '../utils/i18n/i18n.js';
import FilterGroup from './FilterGroup.jsx';
import {
  FILTER_BAR_CLEAR_ALL,
  FILTER_BAR_CLEAR_ALL_TOOL_TIP
} from './VerticalFilterBarConstants.js';

class VerticalFilterBar extends React.Component{

  onFilterChange(filtersValues){
    if(this.props.onFilterChange){
      this.props.onFilterChange(filtersValues);
    }
  }

  resetIsOpen(){
    return this.filters.resetIsOpen();
  }

  onClearAll(){
    let filterValues = {};
    this.onFilterChange(filterValues);
  }

  render(){
    return (
      <div className='vfb-filters'>
        <div className='vfb-header'>{this.props.filterTitle}
          <div className='clear-all' title={i18n(FILTER_BAR_CLEAR_ALL_TOOL_TIP)} onClick={this.onClearAll.bind(this)}>{i18n(FILTER_BAR_CLEAR_ALL)}</div>
        </div>
        <FilterGroup
          ref={(filters) => this.filters = filters}
          data={this.props.data}
          filtersOrder={this.props.filtersOrder}
          filtersConfig={this.props.filtersConfig}
          filtersValues={this.props.filterValues}
          onFilterChange={this.onFilterChange.bind(this)}
        />
      </div>
    );
  }
}
export default VerticalFilterBar;
