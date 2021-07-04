import Modal from 'modal-react-native-web';
import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView } from 'react-native'
import { Overlay, Text, Button } from 'react-native-elements';

export class Popup extends Component {
  protected show:bool = false;
  run() {
    this.show = true;
    this.forceUpdate();
  }
  on_click(i:number) {
    this.show = false;
    this.forceUpdate();
    this.props.func(i);
  }
  render() {
    return (
      <Overlay ModalComponent={ Platform.OS == 'web' ? Modal : undefined} 
        isVisible={this.show} style={styles.container}>
        <KeyboardAvoidingView behavior='padding'>
          <Text h4>{this.props.text}</Text>
          {this.props.children}
          <View style={styles.foot}>
            {this.props.buttons.map((s:string, i)=>{ 
              return <Button key={i} title={s} onPress={ ()=>{this.on_click(i)} } />
            })}
          </View>
        </KeyboardAvoidingView>
      </Overlay>
    )
  }
}

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
    
  }, 
});
