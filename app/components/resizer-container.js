import Ember from 'ember';
import ResizeAware from 'ember-resize/mixins/resize-aware';

export default Ember.Component.extend(ResizeAware, {
  classNames: ['resizer-container'],
  classNameBindings: ['layout'],
  panels: [{title: 'Panel 1', percent: '20'}, {title: 'Panel 2', percent: '60'}, {title: 'Panel 3', percent: '20'}],
  layout: 'cols',
  resizeStart: { x: 0, y: 0 },
  draggingHandle: -1,
  handleSize: 5,
  previousSize: { x: 0, y: 0 },
  dimensions: null,
  containerSize: Ember.computed(function(){
    var val = 0;
    if(this.get('layout') === 'cols'){
      val = window.innerWidth;
    } else {
      val = window.innerHeight;
    }
    return val;
  }),
  actions: {
    resizePanels: function(index, position){
      this.set('draggingHandle', index);
      this.set('resizeStart', position);
      this.updatePanels(index, position);
    }
  },
  create: function(size){
    console.log('action sent.');
    this.get('createPanel');
  },
  didInsertElement: function(){
    var containerSize = this.get('containerSize');
    this.reflowLayout(containerSize);
  },
  didReceiveAttrs: function(){
    console.log('panels', this.get('panels'));
  },
  init: function() {
    var containerSize;
    this._super(...arguments);

    this.create(100);
    this.get('resizeService').on('didResize', event => {
      console.log(`width: ${window.innerWidth}, height: ${window.innerHeight}`);
      containerSize = this.get('containerSize');
      this.reflowLayout(containerSize);
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
  reflowLayout: function(containerSize){
    var handleSize    = this.get('handleSize'),
        panels        = this.get('panels'),
        handlePercent;
    console.log('container size', containerSize);

    // Calculate the handle percentage
    handlePercent = (handleSize / containerSize) * 100;
    //
    handlePercent = (panels.length - 1) * handlePercent / panels.length;

    for(var i = 0; i < panels.length; i++){
      Ember.set(panels[i],'percent', panels[i].percent - handlePercent);
    }
  }
});
