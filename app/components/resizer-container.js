import Ember from 'ember';
import ResizeAware from 'ember-resize/mixins/resize-aware';

export default Ember.Component.extend(ResizeAware, {
  classNames: ['resizer-container'],
  classNameBindings: ['layout', 'resizing'],
  panels: [{title: 'Panel 1', percent: '20'}, {title: 'Panel 2', percent: '60'}, {title: 'Panel 3', percent: '20'}],
  layout: 'cols',
  resizeStart: { x: 0, y: 0 },
  draggingHandle: -1,
  previousSize: null,
  dimensions: null,
  resizing: Ember.computed(function(){
    if(Number.parseInt(this.get('draggingHandle')) >= 0){
      return 'resizing';
    }
  }).property('draggingHandle'),
  containerSize: null,
  actions: {
    resizePanels: function(index, position){
      this.set('draggingHandle', index);
      this.set('resizeStart', position);
      this.updatePanels(index, position);
    }
  },
  create: function(){
    console.log('action sent.');
    this.get('createPanel');
  },
  didInsertElement: function(){
    //var containerSize = Ember.get(this,'containerSize');
    this.reflowLayout();
  },
  init: function() {
    this._super(...arguments);

    this.create(100);
    this.get('resizeService').on('didResize', event => {
      //console.log(`width: ${window.innerWidth}, height: ${window.innerHeight}`);

      //containerSize = this.get('containerSize');
      this.reflowLayout();

    });
  },
  mouseMove: function(e){
    var index = this.get('draggingHandle');
    this.updatePanels(index, {x: e.clientX, y: e.clientY});
  },
  mouseUp: function(){
    this.set('draggingHandle', -1);
  },
  updatePanels: function(index, position){
    var containerSize = this.get('containerSize'),
        panels        = this.get('panels'),
        start,
        distance,
        percent;

    if(index >= 0){
      start = this.get('resizeStart');
      distance = position.x - start.x;
      percent = (distance / containerSize) * 100;

      for(var i = index; i <= index + 1; i++){
        var val = Number.parseFloat(panels[i].percent);
        if(i === index){
          val += percent;
        } else {
          val -= percent;
        }
        Ember.set(panels[i], 'percent', val);
      }

      this.set('resizeStart', position);
    }
  },
  reflowLayout: function(){
    var containerSize;

    // Get the container size
    if(this.get('layout') === 'cols'){
      containerSize = this.$().width();
    } else {
      containerSize = this.$().parent().outerWidth();
    }

    this.set('containerSize', containerSize);
  }
});
