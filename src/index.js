import React from 'react'
import PropTypes from 'prop-types'
import rafThrottle from 'raf-throttle'
import DomPosition from 'dom.position'

export default class ReactScrolledIn extends React.Component {
  static propTypes = {
    scrollElement: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
      PropTypes.element
    ]),
    onChange: PropTypes.func,
    direction: PropTypes.oneOf(['x', 'y']),
    render: PropTypes.func.isRequired
  }

  static defaultProps = {
    direction: 'y',
    onChange: () => {}
  }

  element = null
  elementRect = {}
  scrollElement = null
  scrollRect = {}
  state = {
    visible: false
  }

  handleElementRef = element => {
    if (this.props.ref) this.props.ref(element)

    if (!element || element === this.element) return
    this.element = element
    this.updateScrollElement() // the scroll element prop can depend upon the element prop ( fn(element) )
    this.updateElementRect()
    this.updateVisible()
  }

  handleWindowResize = rafThrottle(() => {
    this.updateElementRect()
    this.updateScrollRect()
  })
  handleScroll = rafThrottle((ev) => {
    this.updateVisible()
  })

  componentDidMount () {
    this.updateScrollElement(this.props.scrollElement)
    window.addEventListener('resize', this.handleWindowResize)
  }

  componentWillUpdate (nextProps, nextState) {
    if (nextProps.scrollElement !== this.props.scrollElement) {
      this.updateScrollElement(nextProps.scrollElement)
    }
  }

  updateScrollElement (elementPointer) {
    let scrollElement
    if (typeof elementPointer === 'string') {
      scrollElement = document.querySelector(elementPointer)
    } else if (typeof elementPointer === 'function') {
      scrollElement = this.element && elementPointer(this.element)
    } else {
      scrollElement = elementPointer || window
    }

    if (scrollElement && scrollElement !== this.scrollElement) {
      if (this.scrollElement) {
        this.scrollElement.removeEventListener('scroll', this.handleScroll)
      }
      scrollElement.addEventListener('scroll', this.handleScroll)

      this.scrollElement = scrollElement
      this.updateScrollRect()
      this.updateVisible()
    }
  }

  updateScrollRect () {
    const {scrollElement} = this
    this.scrollRect = !scrollElement ? {} : {
      ...DomPosition(scrollElement),
      width: scrollElement.offsetWidth,
      height: scrollElement.offsetHeight
    }
  }

  updateElementRect () {
    this.elementRect = !this.element ? {} : DomPosition(this.element)
  }

  updateVisible () {
    const visible = this.getVisible()
    if (typeof visible === 'boolean' && visible !== this.state.visible) {
      this.setState({ visible }, () => {
        this.props.onChange(this.state)
      })
    }
  }

  getVisible () {
    const {scrollElement, scrollRect, element, elementRect} = this

    if (!scrollElement || !element) return

    if (this.props.direction === 'y') {
      const scrollY = scrollElement.pageYOffset || scrollElement.scrollY || scrollElement.scrollTop
      const y = scrollY + scrollRect.height

      return elementRect.top <= y
    } else {
      const scrollX = scrollElement.pageXOffset || scrollElement.scrollX || scrollElement.scrollLeft
      const x = scrollX + scrollRect.width

      return elementRect.left <= x
    }
  }

  componentWillUnmount () {
    if (this.scrollElement) {
      this.scrollElement.removeEventListener('scroll', this.handleScroll)
    }
    window.removeEventListener('resize', this.handleWindowResize)
  }

  render () {
    return <div {...this.props} ref={this.handleElementRef}>
      {this.props.render(this.state)}
    </div>
  }
}
