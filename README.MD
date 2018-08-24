# Vertical Filter Bar

## Overview
The Vertical Filter Bar component shall be used to consolidate and display a collection of all filters which collectively can be used by end users to specify parameter boundaries for a given data set rendered on screen.

## Using Vertical Filter Bar

The Vertical Filter Bar can be included as follows:

```
import VerticalFilterBar from '../vertical-filter-bar/VerticalFilterBar.jsx';

...

filterValueChange(newFilterValue) {
  [do some logic here]
}

...

<VerticalFilterBar
  maxValue={5}
  minValue={-5}
  initialZoom={1}
  value={this.state.zoomLevel}
  onChange={this.zoomChangeCallbackFunction}/>
```

The Vertical Filter Bar can be configured as follows

Property Name | Description
--------------|------------
maxValue | The maximum value the Zoom Slider will go up to
minValue | The minimum value the Zoom Slider will go down to
initialZoom | The zoom the Zoom Slider will initially load with
value | The current value of the Zoom Slider
onChange | The callback function that is passed the new zoom level whenever it is changed

When the zoom level equals the **maxValue**, the '+' button will become disabled
When the zoom level equals the **minValue**, the '-' button will become disabled

## Run & Test Locally
The Vertical Filter Bar component can be launched independently in order to see/test it's capabilities as follows:

1. type the following NPM command from a comand prompt that supports NPM: npm run startDev
3. view the test app at the following URL: http://localhost:8005/vertical-filter-bar/

Once launched, the Vertical Filter Bar will be displayed on the side of the page with a set of demo filters preconfigured. The centre of the page shall list the filter names and their currenlty set/selected values.

Changing a filter value in the Vertical Filter Bar shall update its corresponding displayed value in the main (central) portion of the screen.

![Image of Zoom Slider Test](./screen_cap_zoom-slider_test.JPG)

