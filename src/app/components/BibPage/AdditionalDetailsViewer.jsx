import React from 'react';
import DefinitionList from './DefinitionList';


class AdditionalDetailsViewer extends React.Component {
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


  render(){

    const annotatedMarcDetails = this.props.bib.annotatedMarc.bib.fields.map((field) => {
      return {
        term: field.label,
        definition: field.values.map((value) => {
          return <div title={JSON.stringify(value.source, null, 2)}>
          {value.content}
          </div>
        })
      }
    })

    return(
      <div>
      <button onClick = {this.toggleState}>{this.state.display ? "Hide Full Record" : "View Full Record"}</button>
      <br/>
      {this.state.display && annotatedMarcDetails ? (
        <div style={{backgroundColor: '#efedeb', padding: '5px 20px', position: 'relative', left: '-20px'}}>
          <h3>Source</h3>
          <DefinitionList data={annotatedMarcDetails} />
        </div>
        ) : null}
      </div>
    )
  }
}


export default AdditionalDetailsViewer;
