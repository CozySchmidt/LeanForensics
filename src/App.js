import React,{Component} from 'react';
import logo from './logo.svg';
import './App.css';
import { render } from '@testing-library/react';

class App extends Component{
 
constructor(props){

  super(props)
  this.state={
    sampleid:"",
    sampletype:""

  }
}

handleChange= (event) =>{
  event.preventDefault();
  const {sampleid, value} = event.target;
  this.setState({[sampleid]:value});
  console.log(this.state);
}
  render(){
    return(
      <div className="App">
        <form method="post" action="http://localhost:3001">
          <div className="sampleid">
            <label htmlFor='sampleid'>Enter Sample ID:</label>
            <input type="text" name="sampleid" onChange={this.handleChange}/>
          </div>
          <div className="sampletype">
            <label htmlFor='sampletype'>Enter Sample Type:</label>
            <input type="text" name="sampletype" onChange={this.handleChange}/>
          </div>
          <div className="submit">
            <input type="submit"/>
          </div>
        </form>
      </div>
    );
}
}
export default App;
