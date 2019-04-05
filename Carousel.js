'use strict';

var React = require('react');
var createReactClass = require('create-react-class');
var {
  Dimensions,
  StyleSheet,
  Text,
  View,
} = require('react-native');
var TimerMixin = require('react-timer-mixin');
var CarouselPager = require('./CarouselPager');

var Carousel = createReactClass({
  mixins: [TimerMixin],

  getDefaultProps() {
    return {
      hideIndicators: false,
      indicatorColor: '#000000',
      indicatorSize: 50,
      inactiveIndicatorColor: '#999999',
      indicatorAtBottom: true,
      indicatorOffset: 250,
      indicatorText: '•',
      inactiveIndicatorText: '•',
      width: null,
      initialPage: 0,
      indicatorSpace: 25,
      animate: true,
      delay: 1000,
      loop: true,
      containerStyle: {},
      showSteps: false,
      stepsWrapperStyles: {},
      stepsTextStyles: {}
    };
  },

  renderSliderSteps () {
    const { children, stepsWrapperStyles, stepsTextStyles, hideTheLastItem } = this.props
    let activePage = this.state.activePage + 1
    let allPages = hideTheLastItem ? children.length - 1 : children.length
    if (allPages < activePage) {
      activePage = allPages
    }
    return(
      <View style={stepsWrapperStyles}>
        <Text style={stepsTextStyles}>{`${activePage}/${allPages}`}</Text>
      </View>
    )
  },

  getInitialState() {
    return {
      activePage: this.props.initialPage > 0 ? this.props.initialPage : 0,
      moving: false
    };
  },

  getWidth() {
    if (this.props.width !== null) {
      return this.props.width;
    } else {
      return Dimensions.get('window').width;
    }
  },

  getChildrenLength() {
    return React.Children.count(this.props.children)
  },

  setMoving(value) {
    if (this.state.moving !== value) {
      this.setState({
        moving: value
      })
    }
  },

  nextPage() {
    let nextPage = null
    setTimeout(() => {
      nextPage = this.state.activePage + 1
      this.goToPage(nextPage)
    }, 100)
  },

  prevPage() {
    let prevPage = null
    setTimeout(() => {
      prevPage = this.state.activePage - 1
      this.goToPage(prevPage)
    }, 100)
  },

  componentDidMount() {
    if (this.props.initialPage > 0) {
      this.refs.pager.scrollToPage(this.props.initialPage, false);
    }

    if (this.props.animate && this.props.children){
        this._setUpTimer();
    }
  },

  goToPage(pageIndex) {
    // do not do anything if carousel is already moving
    if (this.state.moving) return
    if (pageIndex >= 0 && pageIndex < this.getChildrenLength()) {
      this.setState({activePage: pageIndex})
      this.refs.pager.scrollToPage(pageIndex)
    }
  },

  renderPageIndicator() {
    let childrenLength = this.getChildrenLength()
    if (this.props.hideIndicators === true || childrenLength <= 1) {
      return null;
    }

    var indicators = [],
        indicatorStyle = this.props.indicatorAtBottom ? { bottom: this.props.indicatorOffset } : { top: this.props.indicatorOffset },
        style, position;
    position = {
      width: childrenLength * this.props.indicatorSpace,
    };
    position.left = (this.getWidth() - position.width) / 2;
    for (var i = 0, l = childrenLength; i < l; i++) {
      style = i === this.state.activePage ? { color: this.props.indicatorColor } : { color: this.props.inactiveIndicatorColor };
      indicators.push(
         <Text
            style={[style, { fontSize: this.props.indicatorSize, lineHeight: this.props.indicatorSize }]}
            key={i}
            onPress={this.goToPage.bind(this,i)}
          >
             { i === this.state.activePage  ? this.props.indicatorText : this.props.inactiveIndicatorText }
          </Text>
      );
    }

    return (
      <View style={[styles.pageIndicator, position, indicatorStyle]}>
        {indicators}
      </View>
    );
  },

  _setUpTimer() {
     if (this.getChildrenLength() > 1) {
         this.clearTimeout(this.timer);
         this.timer = this.setTimeout(this._animateNextPage, this.props.delay);
     }
  },

  _animateNextPage() {
     var activePage = 0;
     if (this.state.activePage < this.getChildrenLength() - 1) {
         activePage = this.state.activePage + 1;
     } else if (!this.props.loop) {
         return;
     }

     this.goToPage(activePage);
     this._setUpTimer();
  },

  _onAnimationBegin() {
    this.clearTimeout(this.timer);
  },

  _onAnimationEnd(activePage) {
    this.setState({activePage});
    if (this.props.onPageChange) {
      this.props.onPageChange(activePage);
    }
  },

  render() {
    return (
      <View style={[{ flex: 1, width: this.getWidth()}]}>
        <CarouselPager
          ref="pager"
          width={this.getWidth()}
          contentContainerStyle={this.props.containerStyle}
          onBegin={this._onAnimationBegin}
          onEnd={this._onAnimationEnd}
          setMoving={this.setMoving}
        >
          {React.Children.toArray(this.props.children)}
        </CarouselPager>
        {this.renderPageIndicator()}
        {this.props.showSteps && this.props.children.length && this.renderSliderSteps()}
      </View>
    );
  },

});

var styles = StyleSheet.create({
  pageIndicator: {
    position: 'absolute',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor:'transparent',
  },
});

module.exports = Carousel;
