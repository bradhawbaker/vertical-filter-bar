import React, {Component} from 'react';

import VerticalFilterBar from '../verticalFilterBar/VerticalFilterBar.jsx';

const FILTER_TITLE = 'FILTER BY';
const dataIntegrityFilterConfiguration = {
  filters: {
    bookmark:{
      hideHeader: true,
      controls : {
        bookmarkControl : {
          type:'checkBox',
          options : [
            {decode:'Bookmark Projects',code:1}
          ],
          filterCriterions:[
            {fieldName : 'id', type : 'string', operator : 'in'}
          ]
        }
      }
    },
    severity:{ // Severity Filter
      label:'Severity',
      controls:{
        regionControl:{
          type:'dropDown',
          multiSelect: false,
          watermark: 'Any Severity',
          options:[
            {decode:'CRITICAL',code:'CRITICAL'},
            {decode:'MAJOR',code:'MAJOR'},
            {decode:'MINOR',code:'MINOR'}
          ],
        }
      }
    },
    category:{ // Category Filter
      label:'Category',
      controls : {
        typeControl :{
          type : 'dropDown',
          multiSelect: true,
          watermark: 'Any Category',
          options:[
            {decode:'INVALID_NAME',code:'INVALID_NAME'},
            {decode:'INVALID_VALUE',code:'INVALID_VALUE'},
            {decode:'MISSING_VALUE',code:'MISSING_VALUE'},
            {decode:'LINK_ERROR',code:'LINK_ERROR'}
          ],
        }
      }
    },
    objectType:{  // Entity Type Filter
      label:'Object Type',
      controls : {
        typeControl :{
          type : 'dropDown',
          multiSelect: false,
          watermark: 'Any Object Type',
          options:[
            {decode:'complex',code:'complex'},
            {decode:'connector',code:'connector'},
            {decode:'customer',code:'customer'},
            {decode:'l3-network',code:'l3-network'}
          ],
        }
      }
    },
    dateRange:{  // Date Range Filter
      label:'Date Range',
      controls : {
        dateControl :{
          type : 'date',
          multiSelect: false,
          watermark: 'Choose Date Range',
          default: 'Last 24 hours',
          dynamicOptions:[
            {decode:'Since Yesterday',code:'Last 24 hours'},
            {decode:'Since Last Week',code:'Last 7 days'},
            {decode:'Since Last Month',code:'Last 30 days'},
            {decode:'Custom Range',code:'Custom Range'}
          ],
        }
      }
    }
  }
};
// const vnfFilterConfiguration = {
//   filters: {
//     1:{ // Orchestration Status
//       label:'Orchestration Status',
//       controls:{
//         regionControl:{
//           type:'dropDown',
//           multiSelect: false,
//           watermark: 'Any Severity',
//           options:[
//             {decode:'Activated',code:'Activated'},
//             {decode:'active',code:'active'},
//             {decode:'Configured',code:'Configured'}
//           ],
//         }
//       }
//     },
//     2:{ // Provisioning Status
//       label:'Provisioning Status',
//       controls : {
//         typeControl :{
//           type : 'dropDown',
//           multiSelect: true,
//           watermark: 'Any Category',
//           options:[
//             {decode:'Active',code:'Active'},
//             {decode:'CAPPED',code:'CAPPED'},
//             {decode:'junk',code:'junk'},
//             {decode:'No Value Selected',code:'NoValueSelected'}
//           ],
//         }
//       }
//     },
//     7:{  // Network Function Type Filter
//       label:'Network Function Type',
//       controls : {
//         typeControl :{
//           type : 'dropDown',
//           multiSelect: false,
//           watermark: 'Any Object Type',
//           options:[
//             {decode:'NF Type 1',code:'NFType1'},
//             {decode:'NF Type 2',code:'NFType2'},
//             {decode:'NF Type 3',code:'NFType3'},
//             {decode:'NF Type 4',code:'NFType4'}
//           ],
//         }
//       }
//     },
//     8:{  // Network Function Role Filter
//       label:'Network Function Role',
//       controls : {
//         typeControl :{
//           type : 'dropDown',
//           multiSelect: false,
//           watermark: 'Any Object Type',
//           options:[
//             {decode:'NF Role 1',code:'NFRole1'},
//             {decode:'NF Role 2',code:'NFRole2'},
//             {decode:'NF Role 3',code:'NFRole3'},
//             {decode:'NF Role 4',code:'NFRole4'}
//           ],
//         }
//       }
//     }
//   }
// };

export default class VerticalFilterBarTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterValues: {}
    };
    this.onFilter = this.onFilter.bind(this);
  }

  onFilter(filterValues) {
    console.log(filterValues);
    this.setState({filterValues: filterValues});
  }

  render() {
    return (
      <div>
        <h1>Vertical Filter Bar Test</h1>

        <VerticalFilterBar
          filtersConfig={dataIntegrityFilterConfiguration.filters}
          filterValues={this.state.filterValues}
          onFilterChange={this.onFilter}
          filterTitle={FILTER_TITLE}
        />
      </div>
    );
  }
}
