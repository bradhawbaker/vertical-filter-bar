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
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import Filter from './Filter.jsx';

class FilterGroup extends React.Component{

  getCopyFiltersValues(){
    if (!isUndefined(this.props.filtersValues)){
      let filtersValues = JSON.parse(JSON.stringify(this.props.filtersValues));
      return filtersValues;
    }
  }

  resetIsOpen(){
    let self = this;
    let promises = [];
    return new Promise(
      function(resolve) {
        self.filtersComponents.forEach((filter)=>{
          promises.push(filter.resetIsOpen());
        });
        Promise.all(promises).then(()=>{
          resolve();
        });
      }
    );
  }

  onFilterChange(filterValues, filterId){
    let filtersValues = this.getCopyFiltersValues();

    // change or add filter
    if (!isEmpty(filterValues)){
      if (isEmpty(filtersValues)){
        filtersValues = {};
      }
      filtersValues[filterId] = filterValues;
    }
    // delete filter
    else{
      if (!isEmpty(filtersValues[filterId])){
        delete filtersValues[filterId];
      }
      // // delete all filters
      // if (isUndefined(filterId)){
      // 	filtersValues = {}
      // }
    }

    if(this.props.onFilterChange){
      this.props.onFilterChange(filtersValues);
    }
  }

  addFilterComponent(filterComponent){
    if(!isEmpty(filterComponent)){
      this.filtersComponents.push(filterComponent);
    }
  }

  render(){
    if(!isEmpty(this.props.filtersConfig)){
      this.filtersComponents = [];
      let filtersIds = this.props.filtersOrder;
      if (filtersIds === undefined){
        filtersIds = Object.keys(this.props.filtersConfig);
      }
      let filters = filtersIds.map((filterId)=>{
        let filterConfig = this.props.filtersConfig[filterId];
        let isDisabled = filterConfig.disabled;
        let defaultFilterConfig = {};

        if(!isEmpty(this.props.filtersValues) && !isEmpty(this.props.filtersValues[filterId])){
          defaultFilterConfig = this.props.filtersValues[filterId].controls;
        }

        return (
          <Filter
            data={this.props.data}
            key={filterId}
            filterId={filterId}
            filterControlsConfig={filterConfig}
            filterControlsValues={defaultFilterConfig}
            isDisabled={isDisabled}
            onFilterChange={this.onFilterChange.bind(this)}
            ref={(filterComponent)=> this.addFilterComponent(filterComponent)}
          />
        );
      });
      return(
        <div className='filter-group'>
          {filters}
          {this.props.children}
        </div>
      );
    }
    return null;
  }
}
export default FilterGroup;