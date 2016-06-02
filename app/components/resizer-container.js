import Ember from 'ember';
import ResizeAware from 'ember-resize/mixins/resize-aware';

export default Ember.Component.extend(ResizeAware, {
  classNames: ['resizer-container'],
  classNameBindings: ['layout'],
  panels: [{title: 'Panel 1', percent: '20'}, {title: 'Panel 2', percent: '60'}, {title: 'Panel 3', percent: '20'}],
  layout: 'cols',
  draggingHandle: -1,
  handleSize: 5,
  resizeStart: { x: 0, y: 0 },
  containerSize: Ember.computed(function(){
    var val = 0;
    // Get the size of the container.
    if(this.get('layout') === 'cols'){
      val = this.$().parents('div').width();
    } else {
      val = this.$().parents('div').height();
    }
    return val;
  }),
  actions: {
    resizePanels: function(index, position){
      this.set('draggingHandle', index);
      this.set('resizeStart', position);
      this.updatePanels(position);
    }
  },
  didInsertElement: function(){
    this.calculateHandles();
  },
  init: function() {
    this._super(...arguments);
    this.get('resizeService').on('didResize', event => {
      console.log(`width: ${window.innerWidth}, height: ${window.innerHeight}`);
      this.calculateHandles();
    });
  },
  mouseMove: function(e){
    this.updatePanels({x: e.clientX, y: e.clientY});
  },
  mouseUp: function(){
    this.set('draggingHandle', -1);
  },
  updatePanels: function(position){
    var index = this.get('draggingHandle'),
      containerSize = this.get('containerSize'),
      panels = this.get('panels'),
      start,
      distance,
      percent;

    if(index >= 0){
      start = this.get('resizeStart');
      distance = position.x - start.x;
      percent = (distance/containerSize)*100;

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
  calculateHandles: function(){
    var handleSize = this.get('handleSize'),
      handlePercent,
      panels = this.get('panels'),
      containerSize = this.get('containerSize');
    console.log(containerSize);
    handlePercent = (handleSize/containerSize)*100;
    var size = (panels.length - 1) * handlePercent / panels.length;
    for(var i = 0; i < panels.length; i++){
      Ember.set(panels[i],'percent', panels[i].percent - size);
    }
  }
});
