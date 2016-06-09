import Ember from 'ember';
import ResizeAware from 'ember-resize/mixins/resize-aware';

export default Ember.Component.extend(ResizeAware, {
  classNames: ['resizer-container'],
  classNameBindings: ['layout', 'resizing'],
  panels: [{title: 'Panel 1', percent: '20'}, {title: 'Panel 2', percent: '60'}, {title: 'Panel 3', percent: '20'}],
  layout: 'cols',
  draggingHandle: -1,
  containerSize: null,
  handleSize: 4,
  resizeStart: { x: 0, y: 0 },
  resizePanels: Ember.computed('draggingHandle', function(){
    var panels  = this.get('panels'),
        index   = Number.parseInt(this.get('draggingHandle')),
        arr     = [];

    // Copy the percentages
    if(index >= 0) {
      for (var i = index; i <= index + 1; i++) {
        var obj = {};
        obj.percent = Number.parseFloat(panels[i].percent);
        arr.push(obj);
      }
    }
    return arr;
  }),
  max: Ember.computed('resizePanels', function() {
    var val = 0;
    var resizePanels = this.get('resizePanels');
    if (resizePanels.length === 2){
      val = resizePanels[0].percent + resizePanels[1].percent;
    }
    return val;
  }),
  min: Ember.computed('containerSize', 'handleSize', function(){
    var containerSize = this.get('containerSize'),
        handleSize    = this.get('handleSize');

    return (handleSize / containerSize) * 100;
  }),
  resizing: Ember.computed('draggingHandle', function(){
    if(Number.parseInt(this.get('draggingHandle')) >= 0){
      return 'resizing';
    }
  }),
  actions: {
    doResize: function(index, position){
      this.set('draggingHandle', index);
      this.set('resizeStart', position);
      this.updatePanels(index, position);
    }
  },
  didInsertElement: function(){
    this.reflowLayout();
  },
  init: function() {
    this._super(...arguments);
    // Handle window resize event
    this.get('resizeService').on('didResize', () => {
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
        resizePanels  = this.get('resizePanels'),
        max           = this.get('max'),
        min           = this.get('min');

    if(index >= 0){
      let start     = this.get('resizeStart'),
          distance  = position.x - start.x,
          percent   = (distance / containerSize) * 100;

      if(resizePanels[0].percent + percent > max - min){
        resizePanels[0].percent = max - min;
        resizePanels[1].percent = min;
      } else if(resizePanels[0].percent + percent < min) {
        resizePanels[0].percent = min;
        resizePanels[1].percent = max - min;
      } else {
        resizePanels[0].percent += percent;
        resizePanels[1].percent -= percent;
      }

      Ember.set(panels[index], 'percent', resizePanels[0].percent);
      Ember.set(panels[index+1], 'percent', resizePanels[1].percent);

      this.set('resizeStart', position);
    }
  },
  reflowLayout: function(){
    var containerSize;

    // Get the container size
    if(this.get('layout') === 'cols'){
      containerSize = this.$().width();
    } else {
      containerSize = this.$().height();
    }
    this.set('containerSize', containerSize);
  }
});
