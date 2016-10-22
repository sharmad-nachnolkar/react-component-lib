import React from 'react'
import ReactDOM from 'react-dom'
import MultiSelect from './components/Multiselect/Multiselect.jsx'
import Calendar from './components/Calendar/Calendar.jsx'

var msProps = {
	dataSource:[
		{key:'apple',value:'a'},
		{key:'oranges',value:'o'},
		{key:'mangoes',value:'m'},
		{key:'bananas',value:'b'},
		{key:'pears',value:'p'}
	],
	placeHolder:'Select a fruit...',
	labelText: 'Your Fruit',
	customClass:'large-width',
	multiSelect:false
}

ReactDOM.render(<MultiSelect {...msProps}/>, document.querySelector("#content"))
ReactDOM.render(<Calendar customClass='large-width'/>, document.querySelector("#content2"))