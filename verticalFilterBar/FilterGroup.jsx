import React from 'react';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import Filter from './Filter.jsx';

class FilterGroup extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      filtersValues: {}
    };
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
    this.setState((prevState) => {
      let filtersValues = prevState.filtersValues;

      if (!isEmpty(filterValues)){
        // change or add filter
        if (isEmpty(filtersValues)){
          filtersValues = {};
        }
        filtersValues[filterId] = filterValues;
      } else{
        // delete filter
        if (!isEmpty(filtersValues) && !isEmpty(filtersValues[filterId])){
          delete filtersValues[filterId];
        }
      }

      if(this.props.onFilterChange){
        this.props.onFilterChange(filtersValues, filterId);
      }

      return {filtersValues: filtersValues};
    });
  }

  addFilterComponent(filterComponent){
    if(!isEmpty(filterComponent)){
      this.filtersComponents.push(filterComponent);
    }
  }

  componentWillMount() {
    if (!isEmpty(this.props.filtersValues)) {
      this.setState({filtersValues: this.props.filtersValues});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.filtersValues, this.props.filtersValues)) {
      this.setState(() => {
        return {filtersValues: nextProps.filtersValues};
      });
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

        if(!isEmpty(this.state.filtersValues) && !isEmpty(this.state.filtersValues[filterId])){
          defaultFilterConfig = this.state.filtersValues[filterId].controls;
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