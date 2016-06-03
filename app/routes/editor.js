import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.findAll('settings');
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
