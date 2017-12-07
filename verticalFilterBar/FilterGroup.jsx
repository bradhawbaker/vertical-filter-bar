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