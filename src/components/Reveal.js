import { useState } from 'react'

import styled from 'styled-components'

const Span = styled.span`
  background: ${props => !props.visible ? props.color : 'transparent'};
  cursor: pointer;
  transition: all 1s cubic-bezier(0.32, 0, 0.67, 0);
  color: ${props => props.color};
`

const Reveal = ({ value, color }) => {
  const [visible, setVisible] = useState(false)

  return (
    <Span color={color} visible={visible} onClick={() => { setVisible(true) }}>
      {value}{` `}
    </Span>
  )
}

export default Reveal