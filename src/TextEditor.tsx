import React, { Component } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic'
import { Bold } from '@ckeditor/ckeditor5-basic-styles'
import { Essentials } from '@ckeditor/ckeditor5-essentials'
import { Italic } from '@ckeditor/ckeditor5-basic-styles'
import { List } from '@ckeditor/ckeditor5-list'
import { ListProperties } from '@ckeditor/ckeditor5-list'
import { Link } from '@ckeditor/ckeditor5-link'
import { Paragraph } from '@ckeditor/ckeditor5-paragraph'
import { Subscript } from '@ckeditor/ckeditor5-basic-styles'
import { Superscript } from '@ckeditor/ckeditor5-basic-styles'
import { Underline } from '@ckeditor/ckeditor5-basic-styles'
import { Table } from '@ckeditor/ckeditor5-table'
import { Autoformat } from '@ckeditor/ckeditor5-autoformat'

export class TextEditor extends Component<React.PropsWithChildren<{}>> {
    private builtinPlugins = [
        Bold,
        Essentials,
        Italic,
        List,
        Paragraph,
        Subscript,
        Superscript,
        Underline,
        Table,
        ListProperties,
        Autoformat,
        Link,
    ]
    private toolbarItems = [
        'bold',
        'italic',
        'underline',
        'subscript',
        'superscript',
        '|',
        'numberedList',
        'bulletedList',
        '|',
        'link',
    ]

    public render() {
        return (
			<CKEditor
				editor={ClassicEditor}
				config={{
					toolbar: { items: this.toolbarItems },
					language: 'en',
					link: {
						addTargetToExternalLinks: true,
					},
					plugins: this.builtinPlugins as any,
				}}
			/>
        )
    }
}
