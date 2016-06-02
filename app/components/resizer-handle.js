import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['resizer-handle'],
  index: 0,
  mouseDown: function(e){
    this.sendAction('resizePanels', this.get('index'), { x: e.clientX, y: e.clientY } );
    return false;
  },
  // mouseMove: function(e){
    // if(this.get('dragging')){
    //   console.log('dragging handle');
    //
    //   var s = this.get('startPosition');
    //   this.set('dragAmount', { x: s.x - e.clientX, y: s.y - e.clientY });
    //   console.log(this.get('dragAmount'));
    //
    //   this.get('onResizer')(this.get('index'), this.get('dragAmount'));
    // }
  // },
  // mouseLeave: function(){
  //   this.set('dragging', false);
  //   this.set('dragAmount', { x: 0, y: 0 });
  // },
  // mouseUp: function(){
  //   this.set('dragging', false);
  //   this.set('dragAmount', { x: 0, y: 0 });
  // }
});
