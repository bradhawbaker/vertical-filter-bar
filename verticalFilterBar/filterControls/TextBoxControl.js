import React, { Component } from "react";
import PropTypes from 'prop-types';



export default class TextBoxControl extends Component {
  constructor(props) {
    super(props);


    this.state = {
      filterText: ""
    };
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }


  handleChange(e) {
    this.setState({
      filterText: e.target.value
    });
  }

  handleFilterClick() {
    let toFilter = {value: this.state.filterText};
    this.props.onFilterControlChange(toFilter, this.props.controlId );
  }

  handleClick = (e) => {
    if(this.box.contains(e.target)) {
      return;
    }
    this.handleFilterClick();
  }

  render() {
    let {watermark} = this.props.config;
    let {filterText} = this.state;

    return (
      <span ref={box =>this.box = box}>
        <input type="text" className="textbox-filter"
               placeholder={watermark}
               value={filterText}
               onChange={e => this.handleChange(e)}
               onKeyDown={e => {
                 if (e.key === "Enter")
                   this.handleFilterClick();
               }}

        />

      </span>
    );
  }
}

TextBoxControl.propTypes = {
  config: PropTypes.object,
  onFilterControlChange: PropTypes.func,
  controlId: PropTypes.string
};
