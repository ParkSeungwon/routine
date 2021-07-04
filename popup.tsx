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
        <KeyboardAvoidingView behavior='padding' style={styles.container} >
          <Text style={styles.text}>{this.props.text}</Text>
          {this.props.children}
          <View style={styles.foot}>
            {this.props.buttons.map((s:string, i)=>{ 
              return <Button raised type='outline' style={styles.button}
                key={i} title={s} onPress={() => { this.on_click(i) }} />
            })}
          </View>
        </KeyboardAvoidingView>
      </Overlay>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    //backgroundColor: '#0f0',
    //alignItems: '',
  },
  foot: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }, 
  button: {
    padding:1,
  },
  text: {
    fontSize: 22,
    padding: 10
  },
});
