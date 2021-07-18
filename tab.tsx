import React, { Component} from 'react'
import { Dimensions, View, Text, StyleSheet, ScrollView, AppState } from 'react-native'
import { FAB, Input, ButtonGroup, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Popup } from './popup.tsx'
import {ToDo} from './todo.tsx'

class TabData {
  title:string = '';
  todos:ToDoData[] = [];
};

export class MyTab extends Component {
  protected current:int = 0;
  protected data:TabData[] = [];
  protected input_text:string = '';
  protected isTab:bool = true;

  protected popup_callback(i: number) {//confirm popup
    console.log(i)//first button clicked 0
    switch (i) {
      case 0:
        console.log('yes function' + this.isTab)
        if (this.isTab) this.remove_tab();
        else this.remove_to_do();
        break;
      case 1:
        console.log('no function');
    }
    this.forceUpdate();
  }

  protected done(i:number):void {//text enter done
    if(i == 1) return;
    if (this.isTab) this.data.push({title: this.input_text, todos: []});
    else {
      if(this.data.length == 0) this.refs.error.run();
      else this.data[this.current].todos.push( {todo: this.input_text, check: false});
    }
    this.forceUpdate();
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
    if(this.data.length > 0) this.refs.callapi.set(this.data[this.current].todos);
    else this.refs.callapi.set([]);
    this.forceUpdate();
  }
  protected remove_to_do() {
    if(this.data[this.current].todos.length == 0) return;
    let to_del:number[] = [];
    for(let i=this.data[this.current].todos.length-1; i>=0; i--) 
      if(this.data[this.current].todos[i].check) to_del.push(i);
    console.log('to_del array : ')
    console.log(to_del);
    for(let i of to_del) this.data[this.current].todos.splice(i, 1);
    //this.refs.callapi.forceUpdate();
  }
  protected reset() {
    for(let ch of this.data[this.current].todos) ch.check = false;
    this.refs.callapi.forceUpdate();
  }
  protected select_tab(index:int) {
    this.current = index;
    if(this.data[this.current]) {
      this.refs.callapi.set(this.data[this.current].todos);
      this.forceUpdate();
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.foot}>
          <Button title='Tab+' onPress={()=>{this.show_popup(true);}} type='outline' raised style={styles.button} />
          <Button title='Tab-' onPress={this.show_confirm.bind(this, true)} type='outline' raised style={styles.button} />
          <Button title='Item+' onPress={this.show_popup.bind(this, false)} type='outline' raised style={styles.button} />
          <Button title='Item-' onPress={this.show_confirm.bind(this, false)} type='outline' raised style={styles.button} />
          <Button title='reset' onPress={this.reset.bind(this)} type='outline' raised style={styles.button}/>
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
          text='' 
          func={this.done.bind(this)} 
          buttons={['Done', 'Cancel']}
        >
          <View style={styles.over}>
          <Input placeholder='enter text' onChangeText={(txt)=>{this.input_text = txt}} />
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
      console.log('loading...\n');
      console.log(this.data);
      this.current = 0;
      this.select_tab(0);
      this.forceUpdate();
    } catch (error) {
    }
  }

  protected save = async () => {
      try {
        this.refs.callapi.sync(this.data.todos);
        await AsyncStorage.setItem('data', JSON.stringify(this.data));
        console.log('saving...\n');
        console.log(this.data);
      } catch (error) {
      }
    };

  componentDidMount() {
    this.load();
    AppState.addEventListener('change', this._handleAppStateChange);
    console.log('componentDidMount');
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
