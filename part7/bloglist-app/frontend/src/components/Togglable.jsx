import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div className="mb-4">
      <div style={hideWhenVisible}>
        <Button
          variant="primary"
          onClick={toggleVisibility}
          className="shadow-sm fw-bold"
        >
          {props.buttonLabel}
        </Button>
      </div>
      <div
        style={showWhenVisible}
        className="p-4 border rounded shadow-sm bg-white"
      >
        {props.children}
        <Button
          variant="outline-secondary"
          onClick={toggleVisibility}
          className="mt-3"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable
