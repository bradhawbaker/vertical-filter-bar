# Vertical Filter Bar

## Overview

The Vertical Filter Bar component shall be used to consolidate and display a collection of all filters which collectively can be used by end users to specify parameter boundaries for a given data set rendered on screen.

[CHANGELOG.md](CHANGELOG.md) contains Release Notes for this package.

[CONTRIBUTING.md](CONTRIBUTING.md) contains guidelines on how to help improve this package.

## Using Vertical Filter Bar

The Vertical Filter Bar can be included as follows:

```jsx
import VerticalFilterBar from '../vertical-filter-bar/VerticalFilterBar.jsx';

...

filterValueChange(newFilterValue) {
  [do some logic here]
}

...

<VerticalFilterBar
            filtersConfig={dataIntegrityFilterConfiguration.filters}
            filterValues={this.state.filterValues}
            onFilterChange={this.onFilter}
            filterTitle={FILTER_TITLE}
            clearAllText={CLEAR_ALL_TEXT}
            clearAllToolTip={CLEAR_ALL_TOOL_TIP}
          />
```

The Vertical Filter Bar can be configured as follows

## Run & Test Locally

The Vertical Filter Bar component can be launched independently in order to see/test it's capabilities as follows:

1. type the following NPM command from a comand prompt that supports NPM: npm run startDev
2. view the test app at the following URL: <http://localhost:8080/>

Once launched, the Vertical Filter Bar will be displayed on the side of the page with a set of demo filters preconfigured. The centre of the page shall list the filter names and their currenlty set/selected values.

Changing a filter value in the Vertical Filter Bar shall update its corresponding displayed value in the main (central) portion of the screen.
