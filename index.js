import React from 'react'
import ReactDOM from 'react-dom'
import MultiSelect from './components/Multiselect'

ReactDOM.render(<MultiSelect dataSource={[{key:'a',value:'b'},{key:'c',value:'d'}]}/>, document.querySelector("#content"))