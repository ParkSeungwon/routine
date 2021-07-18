import React, { Component } from 'react';
import { CheckBox } from 'react-native-elements';
import DraggableFlatList, { RenderItemParams, } from "react-native-draggable-flatlist";
//--legacy-peer-deps option was needed to install this

class ToDoData {
  todo:string = '';
  check:bool = false;
};

export class ToDo extends Component {
  state = {
    todos: ()=>{return [];}
  }

  on_click(i:number) {
    this.state.todos()[i].check = !this.state.todos()[i].check;//!undefined == true
    this.forceUpdate();
  }
  set(todo:TodoData[]) {
    this.setState({todos: ()=> {return todo;}});
  }
  private render_item({item, index, drag, isActive}:RenderItemParams<string[]>) {
    return (
      <CheckBox
        title={item.todo}
        checked={item.check}
        onPress={this.on_click.bind(this, index)}
        onLongPress={drag}
      />
    )
  }

  render() {
    return (
      <DraggableFlatList
        data={this.state.todos()}
        renderItem={this.render_item.bind(this)}
        keyExtractor={(item, index) => {return 'key'+index;}}
        onDragBegin={(index)=>{}}
        //simultaneousHandlers={this.refs.scroll}
        onDragEnd={this.set.bind(this)}
        //activationDistance={20}
      />
    )
  }
};
