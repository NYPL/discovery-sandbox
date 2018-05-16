import React from 'react';

class AdditionalDetailsButton extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      display: false
    }
  }

  render(){
      if(this.state.display){
        return(
          <div>
            <button onClick={() => this.setState({display:false})}>Close Details</button>
            <p> Additional Details Will Go Here </p>
          </div>
        )
      }else{
        return (
          <button onClick={() => this.setState({display:true})}>
          See More Details
          </button>
        )
      }
  }
}


export default AdditionalDetailsButton;
