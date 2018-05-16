import React from 'react';

class AdditionalDetailsButton extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      display: false
    }
    this.toggleState = this.toggleState.bind(this);
  }

  toggleState(){
    this.setState({display: !this.state.display});
  }

  // render(){
  //     if(this.state.display){
  //       return(
  //         <div>
  //           <button onClick={() => this.setState({display:false})}>Close Details</button>
  //           <p> Additional Details Will Go Here </p>
  //         </div>
  //       )
  //     }else{
  //       return (
  //         <button onClick={() => this.setState({display:true})}>
  //         See More Details
  //         </button>
  //       )
  //     }
  // }

  render(){
    return(
      <div>
      <button onClick = {this.toggleState}>{this.state.display ? "Close Details" : "See More Details"}</button>
      <br/>
      {this.state.display ? "Additional Details Will Go Here" : null}
      </div>
    )
  }
}


export default AdditionalDetailsButton;
