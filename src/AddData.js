import React, { Component } from 'react';
import { firebaseApp } from './firebase';
import 'firebase/database';
import 'firebase/storage';
import { formatNumber } from './FormatNumber'

export default class AddData extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addName: "",
      addCost: "",
      addImage: null,
      imageURL: ""
    }
  }

  sendToState(event) {
    if (event.target.id === "ten") {
      this.setState({
        addName: event.target.value
      });
    }
    if (event.target.id === "gia") {
      this.setState({
        addCost: event.target.value
      });
    }
  }

  sendToFirebase() {
    const { addName, addCost, imageURL } = this.state
    const viewData = firebaseApp.database().ref('New_Product').child(`${addName}`)
    if (addName && addCost && imageURL !== "") {
      viewData.set({
        name: addName,
        cost: formatNumber(addCost),  //format lại dạng số
        image: imageURL,
      })
      if (!alert("Thêm thành công!")) {
        window.location.reload()
      }
    }
    else {
      alert("Bạn phải nhập vào đầy đủ thông tin!")
    }
  }

  pickImage(event) {
    if (event.target.files[0]) {
      const addImage = event.target.files[0];
      this.setState(() => ({ addImage }));
    }
  }

  uploadImage() {
    const { addImage, addName } = this.state
    const uploadTask = firebaseApp.storage().ref(`images/${addName}`).put(addImage);
    if (addName === "") {
      alert("Hãy nhập tên sản phẩm trước khi upload ảnh")
    } else {
      uploadTask.on('state_changed', () => {
        firebaseApp.storage().ref('images').child(addName).getDownloadURL().then(imageURL => {
          console.log(imageURL);
          this.setState({ imageURL });
          alert(
            `Upload ảnh thành công!
            Bấm "Thêm sản phẩm" để thêm sản phẩm mới`)
        })
      })
    }
  }

  render() {
    return (
      <div>
        <form>
          <label>
            Nhập tên SP
          <input type="text" id="ten" value={this.state.addName}
              onChange={this.sendToState.bind(this)} />
          </label><br />
          <label>
            Nhập giá
          <input type="text" id="gia" value={this.state.addCost}
              onChange={this.sendToState.bind(this)} />
          </label><br />
          <label>
            Tải ảnh lên
          </label><br />
        </form>
        <input type="file" onChange={this.pickImage.bind(this)} />
        <button onClick={this.uploadImage.bind(this)}>Upload ảnh</button><br />
        <button onClick={this.sendToFirebase.bind(this)}
          ref={ref => this.send = ref}
          disabled={!this.state.imageURL}
          style={{ margin: 20 }}>
          <div style={{ fontSize: 25 }}>Thêm sản phẩm</div>
        </button>
      </div>
    )
  }
}
