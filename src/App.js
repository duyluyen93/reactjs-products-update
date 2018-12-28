import React, { Component } from 'react';
import './App.css';
import { firebaseApp } from './firebase';
import 'firebase/database';
import 'firebase/storage';
import AddData from './AddData';
import DataHeader from './DataHeader'

const getData = firebaseApp.database().ref();

class App extends Component {
  constructor(props) {
    super(props)
    document.title = "Backend Web"
    this.state = {
      image: [],
      cost: [],
      name: [],
      index: [],
      newImage: null,
      newImageURL: ""
    }
  }

  componentDidMount() {
    getData.child('New_Product').once('value', snapshot => snapshot.forEach(
      childSnap => {
        this.setState({
          index: this.state.index.concat([childSnap.key]),
          name: this.state.name.concat([childSnap.val().name]),
          cost: this.state.cost.concat([childSnap.val().cost]),
          image: this.state.image.concat([childSnap.val().image]),
        })
      }
    ));
  }

  viewData() {
    var table = [];
    var children = [];
    for (let i = 0; i < this.state.index.length; i++) {
      for (let j = 0; j < this.state.index.length; j++) {
        children.push(
          <tr className="hien" id={j} key={j}>
            <td className="info">{this.state.name[j]}</td>
            <td className="info">{this.state.cost[j]}</td>
            <td className="info">
              <img style={{ height: 100, width: 100 }} src={this.state.image[j]} alt="" />
              <input className="hide" type="file" onChange={this.pickNewImage.bind(this)} />
              <button className="hide" onClick={this.updateNewImage.bind(this)}>Thay đổi ảnh</button>
            </td>
            <td className="nut">
              <button className="sua" onClick={this.editData.bind(this)}>Sửa</button>
              <button className="luu hide" onClick={this.saveData.bind(this)}>Lưu</button>
              <button className="xoa" onClick={this.removeData.bind(this)}>Xoá</button>
            </td>
          </tr>
        )
      }
      table.push(children);
      return table;
    }
  }

  pickNewImage(event) {
    if (event.target.files[0]) {
      const newImage = event.target.files[0];
      this.setState(() => ({ newImage }));
    }
  }

  updateNewImage(event) {
    const { newImage } = this.state
    var id = event.target.closest("tr").id;
    var selectToEdit = document.getElementsByClassName("hien")[id]
    var newImageName = selectToEdit.firstElementChild.textContent
    console.log(newImageName)
    const uploadTask = firebaseApp.storage().ref(`images/${newImageName}`).put(newImage);
    uploadTask.on('state_changed', () => {
      firebaseApp.storage().ref('images').child(newImageName).getDownloadURL().then(imageURL => {
        console.log(imageURL);
        this.setState({ newImageURL: imageURL });
        getData.child(`New_Product/${this.state.index[id]}`).update({
          image: imageURL
        })
        alert("Thay đổi ảnh thành công!")
      })
    })
  }

  removeData(event) {
    var id = event.target.closest("tr").id;
    getData.child(`New_Product/${this.state.index[id]}`).remove();
    // xóa trên giao diện web

    const getImage = firebaseApp.storage().ref();
    getImage.child(`images/${this.state.index[id]}`).delete();
    setTimeout(() => {
      if (!alert("Xoá sản phẩm thành công!")) {
        window.location.reload()
      }
    }, 500)
    // xóa trên server Firebase
  }

  editData(event) {
    var id = event.target.closest("tr").id
    var selectToEdit = document.getElementsByClassName("hien")[id]
    var updateImage = selectToEdit.childNodes[2]
    var button = document.getElementsByClassName("nut")[id]
    for (let i = 0; i < 2; i++) {
      var child = selectToEdit.childNodes[i]
      child.setAttribute("contenteditable", "true")
    }
    selectToEdit.childNodes[2].setAttribute("imageEdit", "true")
    button.childNodes[1].classList.remove("hide")
    button.childNodes[0].classList.add("hide")
    button.childNodes[2].classList.add("hide")
    updateImage.childNodes[1].classList.remove("hide")
    updateImage.childNodes[2].classList.remove("hide")
  }

  saveData(event) {
    var id = event.target.closest("tr").id
    var selectToEdit = document.getElementsByClassName("hien")[id]
    var updateImage = selectToEdit.childNodes[2]
    var button = document.getElementsByClassName("nut")[id]
    for (let i = 0; i < 2; i++) {
      var child = selectToEdit.childNodes[i]
      child.setAttribute("contenteditable", "false")
      // thêm thuộc tính này để text khi bấm vào sẽ cho phép sửa nội dung
    }
    selectToEdit.childNodes[2].setAttribute("imageEdit", "false")
    button.childNodes[0].classList.remove("hide")
    button.childNodes[2].classList.remove("hide")
    button.childNodes[1].classList.add("hide")
    updateImage.childNodes[1].classList.add("hide")
    updateImage.childNodes[2].classList.add("hide")
    // ẩn hiện các button tương ứng
    getData.child(`New_Product/${this.state.index[id]}`).update({
      name: selectToEdit.childNodes[0].textContent,
      cost: selectToEdit.childNodes[1].textContent
    })
    // hàm update cho phép thay đổi dữ liệu trên Database của Firebase
    if (!alert("Cập nhật thông tin thành công!")) {
      window.location.reload()
    }
  }

  render() {
    return (
      <div>
        <AddData />
        <div>
          <table id="bang_chinh">
            <tbody>
              <DataHeader />
              {this.viewData()}
              {/* TODO: hiển thị nội dung realtime từ Firebase */}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;