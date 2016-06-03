import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  containerId: attr('number'),
  order: attr('number'),
  title: attr('string'),
  size: attr('string')
});
