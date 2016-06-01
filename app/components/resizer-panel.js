import Ember from 'ember';

export default Ember.Component.extend(Ember.Evented, {
  classNames: ['resizer-panel'],
  attributeBindings: ['styleString:style'],
  percent: 50,
  styleString: function(){
    return Ember.String.htmlSafe('width: '+ this.get('percent') + '%');
  }.property('percent')
});
