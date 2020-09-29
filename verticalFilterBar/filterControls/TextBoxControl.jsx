import React, { Component } from "react";
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

export default class TextBoxControl extends Component {
  constructor(props) {
    super(props);


    this.state = {
      filterText: "",
      currentCriterion: {}
    };
  }

  componentWillMount() {
    if (this.props.currentCriterion && this.props.currentCriterion.values) {
      this.handleTextChange(this.props.currentCriterion);
    }
  }

  componentDidUpdate() {
    let {currentCriterion} = this.props;
    if (currentCriterion && currentCriterion.values && 
      // Object.keys(currentCriterion.values).length === 0 &&
      (!isEqual(this.state.currentCriterion, currentCriterion))) {
        // only triggering when currentCriterion.values is empty ... this signifies 
        // the value was cleared from externally (i.e. clear icon)
        this.handleTextChange(currentCriterion);
    } else if ((!currentCriterion || !currentCriterion.values) && this.state.currentCriterion.values) {
      // need to clear any previously set values
      this.handleTextChange({});
    }
  }

  handleTextChange(currentCriterion) {
    const value = currentCriterion.values;
    // const {controlId} = this.props;
    if (!isEmpty(value)) {
      this.setState({
          filterText: value,
          currentCriterion: currentCriterion
        }
      );
      // this.props.onFilterControlChange({values: value}, controlId);
    } else {
      this.setState({
        filterText: "",
        currentCriterion: currentCriterion
      });
      // this.props.onFilterControlChange({}, controlId);
    }
  }

  // child component had a change, just update the filterText
  // (wait for hitting the 'return/enter' key to notify parent component)
  handleChange(e) {
    this.setState({
      filterText: e.target.value
    });
  }

  // this component is initiating the changing of the filter value,
  // notify parent component (i.e. onFitlerControlChange callback)
  handleFilterClick() {
    let toFilter = {};
    if(!isEmpty(this.state.filterText)) {
      toFilter = {values: this.state.filterText};
    }
    this.props.onFilterControlChange(toFilter, this.props.controlId );
  }


  render() {
    const {theme} = this.props;
    const {watermark} = this.props.config;
    const {filterText} = this.state;

    return (

        <input type="text" className={theme.textboxFilter}
               placeholder={watermark}
               value={filterText}
               onChange={e => this.handleChange(e)}
               onKeyDown={e => {
                 if (e.key === "Enter")
                   this.handleFilterClick();
               }}

        />

    );
  }
}

TextBoxControl.propTypes = {
  config: PropTypes.object,
  onFilterControlChange: PropTypes.func,
  controlId: PropTypes.string,
  currentCriterion: PropTypes.object,
  theme: PropTypes.object
};
