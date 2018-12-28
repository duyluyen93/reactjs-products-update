import React, { Component } from 'react'

export default class DataHeader extends Component {
  render() {
    return (
      <tr id="title">
        <td style={{ fontSize: 25, color: "yellow" }}>Tên sản phẩm</td>
        <td style={{ fontSize: 25, color: "yellow" }}>Giá</td>
        <td style={{ fontSize: 25, color: "yellow" }}>File ảnh</td>
      </tr>
    )
  }
}
