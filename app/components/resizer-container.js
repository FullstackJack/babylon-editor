import Ember from 'ember';

export default Ember.Component.extend(Ember.Evented, {
  classNames: ['resizer-container'],
  classNameBindings: ['layout'],
  panels: [{title: 'Panel 1', size: '60'}, {title: 'Panel 2', size: '40'}],
  layout: 'cols',
  dragging: false,
  init: function(){
    this._super(...arguments);
  },
  didInsertElement: function(){
    console.log(this.$().css('width'));
  },
  actions: {
    onResizer: function(index, amount){
      console.log('Received drag with index: '+ index +' and size: '+amount.x);
      this.updatePanels(index, amount);
    }
  },
  updatePanels: function(index, amount){
    var width = this.$().parents('div').width();
    var panels = this.get('panels');
    for(var i = index; i < index + 1; i++ ){
      var panel = panels[i];
      var percent = amount.x/width;
      var size = Ember.get(panel,'size');
      var value = size - percent;
      console.log(value);
      Ember.set(panel, 'size', value);
      console.log(panel);

      panels[i] = panel;
      console.log("Percent: "+percent);
      //console.log(panel);
    }
    this.set('panels', panels);
  }
});
