import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['resizer-panel'],
  attributeBindings: ['styleString:style'],
  percent: 50,
  styleString: function(){
    return 'width: '+ this.get('percent') + '%';
  }.property('percent')
});
