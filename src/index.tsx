import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { TextEditor } from './TextEditor'

const App: React.FunctionComponent = () => {
    return (
		<BrowserRouter>
			<Routes>
				<Route path="/*" element={<TextEditor />} />
			</Routes>
		</BrowserRouter>
    )
}

ReactDOM.render(<App />, document.getElementById('react-root') as HTMLElement)
