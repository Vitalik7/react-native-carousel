var React = require('react');
var { View } = require('react-native');
import PagerView from 'react-native-pager-view'

var CarouselPager = React.createClass({

  scrollToPage(page, animated) {
    if (typeof animated === 'undefined') {
      animated = true;
    }
    if (animated) {
      this.refs.viewPager.setPage(page);
    } else {
      this.refs.viewPager.setPageWithoutAnimation(page);
    }
    this._onPageSelected(page);
  },

  _onPageSelected(page) {
    this.props.onEnd(page);
  },

  render() {
    return <PagerView
      ref="viewPager"
      initialPage={0}
      style={{ width: '100%', height: '100%' }}
      orientation={this.props.orientation || 'horizontal'}
      onPageScroll={this.props.onBegin}
      onPageSelected={(e) => this._onPageSelected(e.nativeEvent.position)}
      >
        {this.props.children.map((c, idx) => <View key={idx} style={{flex: 1}}>{c}</View>)}
      </PagerView>;
  },
});

module.exports = CarouselPager;
