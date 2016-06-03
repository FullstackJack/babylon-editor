import Ember from 'ember';

export default Ember.Controller.extend({
  init: function(){
    console.log('model', this.get('model'));
  },
  actions: {
    createPanel: function(size){
      console.log('size', size);
      // var panel = this.store.createRecord('panel', {
      //   size: size
      // });
      // panel.save();
    }
  }
});
