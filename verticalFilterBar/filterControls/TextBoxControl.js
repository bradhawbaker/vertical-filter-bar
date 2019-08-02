import React, { Component } from "react";
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';



export default class TextBoxControl extends Component {
  constructor(props) {
    super(props);


    this.state = {
      filterText: ""
    };
  }

  componentWillMount() {
    if (this.props.currentCriterion && this.props.currentCriterion.values) {
      this.handleTextChange(this.props.currentCriterion.values);
    }
  }

  componentDidUpdate() {
    let {currentCriterion} = this.props;
    if (currentCriterion && currentCriterion.values &&
      (!isEqual(this.state.filterText, currentCriterion.values))) {
        this.handleTextChange(currentCriterion.values);
    }
  }

  handleTextChange(value){
    let selectedValues = {};
    if (!isEmpty(value)){
      selectedValues.values = value;
      this.setState({filterText: value});
    } else {
      this.setState({filterText: ""});
    }


    this.props.onFilterControlChange(selectedValues, this.props.controlId);
  }

  handleChange(e) {
    this.setState({
      filterText: e.target.value
    });
  }

  handleFilterClick() {
    let toFilter = {values: this.state.filterText};
    this.props.onFilterControlChange(toFilter, this.props.controlId );
  }


  render() {
    let {watermark} = this.props.config;
    let {filterText} = this.state;

    return (

        <input type="text" className="textbox-filter"
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
  currentCriterion: PropTypes.obj
};
