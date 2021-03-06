import DropDownControlFilter from "./dropDownFilterControl.jsx";
import DateFilterControl from "./dateFilterControl.jsx";
import TextBoxControl from "./TextBoxControl.jsx";

function getFilterControlType(controlFilterConfig) {
  var Type; // make sure this var starts with a capital letter
  if (controlFilterConfig.type === "dropDown") {
    Type = DropDownControlFilter;
  } else if (controlFilterConfig.type === "date") {
    Type = DateFilterControl;
  } else if (controlFilterConfig.type === "textBox") {
    Type = TextBoxControl;
  } // else {
  //console.log('ERROR: Type ' + controlFilterConfig.type + ' unknown.');
  //}
  return Type;
}
export default getFilterControlType;
