import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['resizer-panel'],
  attributeBindings: ['styleString:style'],
  percent: 0,
  styleString: function(){
    return Ember.String.htmlSafe(`width: ${this.get('percent')}%`);
  }.property('percent')
});
