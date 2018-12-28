import React, {Component} from 'react';
import 'firebase/storage';
import { firebaseApp } from './firebase/index'

class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      url: '',
      progress: 0
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }
  handleChange = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({image}));
    }
  }
  handleUpload = () => {
      // const {image} = this.state;
      const uploadTask = firebaseApp.storage().ref(`images/${this.state.image.name}`).put(this.state.image);
      uploadTask.on('state_changed', 
      // (snapshot) => {
      //   const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      //   this.setState({progress});
      // }, 
      // (error) => {
      //   console.log(error);
      // }, 
    () => {
        firebaseApp.storage().ref('images').child(this.state.image.name).getDownloadURL().then(url => {
            console.log(url);
            this.setState({url});
        })
    });
  }
  render() {
    const style = {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    };
    return (
      <div style={style}>
      <progress value={this.state.progress} max="100"/>
      <br/>
        <input type="file" onChange={this.handleChange}/>
        <button onClick={this.handleUpload}>Upload</button>
        <br/>
        <img src={this.state.url || 'http://via.placeholder.com/400x300'} alt="Uploaded images" height="300" width="400"/>
      </div>
    )
  }
}

export default Example;