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

  definitionItem(value){
    if (value.label) { //if there is a label, this item must be a linked item
      return (
        <div>
        <a  href={value.content} title={JSON.stringify(value.source, null, 2)}>
        {value.label}
        </a>
        </div> //why is there not a break here automatically?
    );
    } else { //currently there is only one other type of item
      return (
        <div title={JSON.stringify(value.source, null, 2)}>
        {value.content}
        </div>
    );
    }
  }


  render(){

    const annotatedMarcDetails = this.props.bib.annotatedMarc.bib.fields.map((field) => {
      return {
        term: field.label,
        definition: field.values.map((value) => {
          return this.definitionItem(value)/* <div title={JSON.stringify(value.source, null, 2)}>
          {value.content}
          </div> */// replace this div with this.definitionItem(value)
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
