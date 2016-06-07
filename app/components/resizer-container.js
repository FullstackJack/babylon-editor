import Ember from 'ember';
import ResizeAware from 'ember-resize/mixins/resize-aware';

export default Ember.Component.extend(ResizeAware, {
  classNames: ['resizer-container'],
  classNameBindings: ['layout', 'resizing'],
  panels: [{title: 'Panel 1', percent: '20'}, {title: 'Panel 2', percent: '60'}, {title: 'Panel 3', percent: '20'}],
  layout: 'cols',
  draggingHandle: -1,
  containerSize: null,
  previousSize: null,
  dimensions: null,
  resizeStart: { x: 0, y: 0 },
  resizePanels: Ember.computed('draggingHandle',function(){
    var panels = this.get('panels'),
        index = Number.parseInt(this.get('draggingHandle')),
        copy = [];

    // Copy the percents
    if(index >= 0){
      console.log('Should copy.');
      for(var i = index; i <= index + 1; i++){
        console.log('panels', panels[i]);
        copy[i] = {};
        copy[i].percent = Number.parseFloat(panels[i].percent);
      }
    }
    return copy;
  }),
  resizing: Ember.computed(function(){
    if(Number.parseInt(this.get('draggingHandle')) >= 0){
      return 'resizing';
    }
  }).property('draggingHandle'),
  actions: {
    resizePanels: function(index, position){
      var panels = this.get('panels');
      this.set('draggingHandle', index);
      console.log(this.get('draggingHandle'));
      this.set('resizeStart', position);
      console.log(panels);
      //this.set('resizePanels', panels.slice(index, index+2));
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
        resizePanels  = this.get('resizePanels'),
        start,
        distance,
        percent,
        min = 1,
        max;

    if(index >= 0){
      max = resizePanels[0].percent + resizePanels[1].percent;
      start = this.get('resizeStart');
      distance = position.x - start.x;
      percent = (distance / containerSize) * 100;

      for(var i = index; i <= index + 1; i++){
        var val = Number.parseFloat(panels[i].percent);
          console.log('max',max);
          if (i === index) {
            var newPercent = val + percent;
            console.log('newPercent',newPercent);
            if(newPercent < max) {
              console.log('New percent is less than max.');
              val += percent;
            }
          } else {
            var newPercent = val - percent;
            if(newPercent > min) {
              val -= percent;
            }

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
      containerSize = this.$().height();
    }

    this.set('containerSize', containerSize);
  }
});
