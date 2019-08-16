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
      (!isEqual(this.state.currentCriterion, currentCriterion))) {
        this.handleTextChange(currentCriterion);
    }
  }

  handleTextChange(currentCriterion){
    let value = currentCriterion.values;
    if (!isEmpty(value)){
      this.setState({filterText: value,
        currentCriterion: currentCriterion }
        );
    } else {
      this.setState({filterText: "",
        currentCriterion: currentCriterion});
    }
  }

  handleChange(e) {
    this.setState({
      filterText: e.target.value
    });
  }

  handleFilterClick() {
    let toFilter = {};
    if(!isEmpty(this.state.filterText)) {
      toFilter = {values: this.state.filterText};
    }
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
