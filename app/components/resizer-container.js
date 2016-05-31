import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['resizer-container'],
  classNameBindings: ['layout'],
  panels: [{title: 'Panel 1', size: '60%'}, {title: 'Panel 2'}],
  layout: 'cols',
  init: function(){
    this._super(...arguments);

    var len = this.get('panels').length;
    for(var i=0; i < len; i++ ){
      var panel = this.get('panels')[i];
      console.log(panel);
    }

  }
});
