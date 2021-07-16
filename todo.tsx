import React, { Component } from 'react';
import { CheckBox } from 'react-native-elements';
import DraggableFlatList, { RenderItemParams, } from "react-native-draggable-flatlist";
//--legacy-peer-deps option was needed to install this

export class ToDo extends Component {
  protected todos:string[] = [];
  protected check:bool[] = [];

  on_click(i:number) {
    this.check[i] = !this.check[i];//!undefined == true
    this.forceUpdate();
  }
  set_check(check_ar:bool[]) {
    this.check = check_ar;
    this.forceUpdate();
  }
  set_todo(todo:string[]) {
    this.todos = todo;
    this.forceUpdate();
  }
  get_check() {
    return this.check;
  }
  get_todos() {
    return this.todos;
  }
  private render_item({item, index, drag, isActive}:RenderItemParams<string[]>) {
    return (
      <CheckBox
        title={item}
        checked={this.check[index]}
        onPress={this.on_click.bind(this, index)}
        onLongPress={drag}
      />
    )
  }
  private set_data(data) {//{from:number, to:number, data:}
    let [check] = this.check.splice(data.from, 1);
    this.check.splice(data.to, 0, check);
    this.todos = data.data;
    this.forceUpdate();
  }

  render() {
    return (
      <DraggableFlatList
        data={this.todos}
        renderItem={this.render_item.bind(this)}
        keyExtractor={(item, index) => {return 'key'+index;}}
        onDragBegin={(index)=>{}}
        //simultaneousHandlers={this.refs.scroll}
        onDragEnd={this.set_data.bind(this)}
        //activationDistance={20}
      />
    )
  }
};
