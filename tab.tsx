import React, { Component} from 'react'
import { Dimensions, View, Text, StyleSheet, ScrollView, AppState } from 'react-native'
import { FAB, Input, ButtonGroup, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Popup } from './popup.tsx'
import {ToDo} from './todo.tsx'

class ToDoData {
  todo:string = '';
  check:bool = false;
};

class TabData {
  title:string = '';
  todos:ToDoData[] = [];
};

export class MyTab extends Component {
  protected current:int = 0;
  protected data:TabData[] = [];
  protected input_text:string = '';
  protected isTab:bool = true;

  private update_list() {
    this.refs.callapi.set_todo(this.data[this.current].todos.map(
      (todo)=>{return todo.todo;}))
    this.refs.callapi.set_check(this.data[this.current].todos.map(
      (todo)=>{return todo.check;}))
  }

  protected popup_callback(i: number) {//confirm popup
    console.log(i)//first button clicked 0
    switch (i) {
      case 0:
        console.log('yes function' + this.isTab)
        if (this.isTab) this.remove_tab();
        else this.remove_to_do();
        this.forceUpdate();
        break;
      case 1:
        console.log('no function');
    }
    this.forceUpdate();
  }

  protected done(i:number):void {//text enter done
    if(i == 1) return;
    if (this.isTab) {
      this.data.push({title: this.input_text, todos: []});
      this.forceUpdate();
    } else {
      if(this.data.length == 0) {
        this.refs.error.run();
        return;
      }
      this.data[this.current].todos.push( {todo: this.input_text, check: false});
      this.update_list();
    }
  }
  protected show_popup(isTab:bool) {
    //this.input_text = '';
    this.isTab = isTab;
    this.refs.enter.run();
  }
  protected show_confirm(isTab:bool) {
    this.isTab = isTab;
    this.refs.popup.run();
  }
  protected remove_tab() {
    if(this.data.length == 0) return;
    this.data.splice(this.current, 1);
    if(this.current > 0) this.current--;
    if(this.data.length > 0) {
      this.refs.callapi.set_todo(this.data[this.current].todos.map(
        (todo) => { return todo.todo; }));
      this.refs.callapi.set_check(this.data[this.current].todos.map(
        (todo) => { return todo.check; }))
    } else {
      this.refs.callapi.set_todo([]);
      this.refs.callapi.set_check([]);
    }
    this.forceUpdate();
  }
  protected remove_to_do() {
    this.save_current();
    let to_del = this.refs.callapi.get_check();
    this.data[this.current].todos
      = this.data[this.current].todos.filter((todo, i) => {return !to_del[i]; });
    this.update_list();
  }
  protected reset() {
    this.save_current();
    for(let ch of this.data[this.current].todos) ch.check = false;
    this.update_list();
  }
  private save_current() {
    let ar = this.refs.callapi.get_check();
    let todos_ar = this.refs.callapi.get_todos();
    let i = 0;
    for(let todo of this.data[this.current].todos) {
      todo.check = ar[i];
      todo.todo = todos_ar[i++];
    }
  }
  protected select_tab(index:int) {
    this.save_current();
    this.current = index;
    this.update_list();
    this.forceUpdate();
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.foot}>
          <Button title='Tab+' onPress={()=>{this.show_popup(true);}} type='outline' raised style={styles.button} />
          <Button title='Tab-' onPress={this.show_confirm.bind(this, true)} type='outline' raised style={styles.button} />
          <Button title='Item+' onPress={this.show_popup.bind(this, false)} type='outline' raised style={styles.button} />
          <Button title='Item-' onPress={this.show_confirm.bind(this, false)} type='outline'raised style={styles.button} />
          <Button title='reset' onPress={this.reset.bind(this)} type='outline'raised style={styles.button}/>
          {/*<Button title='save' onPress={this.save} />*/}
          {/*<Button title='load' onPress={this.load} />*/}
        </View>

        <ButtonGroup 
          selectedIndex={this.current} 
          buttons={this.data.map((tab)=>{return tab.title;})} 
          onPress={this.select_tab.bind(this)}
        />
        <ScrollView> 
          <ToDo ref='callapi' />
        </ScrollView>

        <Popup ref='enter'
          text='Enter text' 
          func={this.done.bind(this)} 
          buttons={['Done', 'Cancel']}
        >
          <View style={styles.over}>
          <Input placeholder='enter' onChangeText={(txt)=>{this.input_text = txt}} />
          </View>
        </Popup>

        <Popup ref='popup' 
          func={this.popup_callback.bind(this)} 
          text='Are you sure?' 
          buttons={['Confirm', 'Cancel']}
        />
        <Popup ref='error'
          func={(i)=>{}}
          text='Create Tab first!!'
          buttons={['OK']}
        />
        </View>
    );
  }

  protected load  = async () => {
    try {
      const data = await AsyncStorage.getItem('data');
      if(data != null) //for first launch
        this.data = JSON.parse(data);
      this.current = 0;
      this.update_list();
      this.forceUpdate();
    } catch (error) {
    }
  }

  protected save = async () => {
      try {
        await AsyncStorage.setItem('data', JSON.stringify(this.data));
      } catch (error) {
      }
    };

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    this.load();
    //if(this.data.length == 0) this.titles.push('+');
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'background' || nextAppState === 'inactive') this.save();
  };

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%'
    //backgroundColor: '#0f0',
    //alignItems: '',
    //justifyContent: 'center',
  },
  foot: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  }, 
  button: {
    padding:1
  },
  over: {
    width: Dimensions.get('window').width * 0.7
  }
});
