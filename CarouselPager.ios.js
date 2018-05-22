var React = require('react');
var createReactClass = require('create-react-class');
var {
  ScrollView,
  Dimensions
} = require('react-native');

var CarouselPager = createReactClass({

  getInitialState() {
    return {
      x: 0
    }
  },

  scrollToPage(page, animated) {
    if (typeof animated === 'undefined') {
      animated = true;
    }
    let newX = page * this.props.width
    if (animated && this.state.x !== newX) this.props.setMoving(true)
    this.refs.scrollView.scrollTo({
      x: newX,
      y: 0,
      animated: animated
    });
    if (!animated) {
      // fake scrollEnd event if not animated
      this._onMomentumScrollEnd({nativeEvent: {contentOffset: {x: newX}}})
    }
  },

  _onMomentumScrollEnd(e) {
    this.props.setMoving(false)
    var activePage = e.nativeEvent.contentOffset.x / this.props.width;
    this.props.onEnd(Math.round(activePage));
    this.setState({
      x: e.nativeEvent.contentOffset.x
    })
  },

  render() {
    return <ScrollView ref="scrollView"
      contentContainerStyle={this.props.contentContainerStyle}
      automaticallyAdjustContentInsets={false}
      horizontal={true}
      pagingEnabled={true}
      showsHorizontalScrollIndicator={false}
      bounces={false}
      onScrollBeginDrag={this.props.onBegin}
      onMomentumScrollEnd={this._onMomentumScrollEnd}
      scrollsToTop={false}
    >
      {this.props.children}
    </ScrollView>;
  },
});

module.exports = CarouselPager;
