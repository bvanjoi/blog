import { schema } from "prosemirror-schema-basic"
import { EditorState } from "prosemirror-state"
import { EditorView }  from "prosemirror-view"
import { undo, redo, history } from "prosemirror-history"
import { keymap } from "prosemirror-keymap"
import { baseKeymap } from 'prosemirror-commands';
import { DOMParser, Slice } from 'prosemirror-model';
import { ReplaceStep, Transform } from 'prosemirror-transform';

// schema 用于定义文档模型的结构
let state = EditorState.create({
  schema,
  plugins: [
    history(),
    keymap({"Mod-z": undo, "Mod-y": redo}),
		keymap(baseKeymap)
  ],
	doc: DOMParser.fromSchema(schema).parse(
		document.querySelector('.init-doc')
		)
})

view = new EditorView(
	document.getElementById('editor'), 
	{
 		state,
  	dispatchTransaction(transaction) {
  	  console.log("Document size went from", transaction.before.content.size,
                "to", transaction.doc.content.size)
    	let newState = view.state.apply(transaction)
    	view.updateState(newState)
  	}
	}
)

// ---------
const step = new ReplaceStep(2,5, Slice.empty);
result = step.apply(view.state.doc);

// ---------

const step2 = new ReplaceStep(0, 5, Slice.empty);
failedResult = step2.apply(view.state.doc);

// --------

tr = new Transform(view.state.doc);
tr.split(2);

// -----
const step3 = new ReplaceStep(2,6, Slice.empty);
// 相当于
// 0   1 2 3 4 5 6    7
//  <p> h e l l o </p>
// ->
// 0   1  2    3
//  <p> h  </p> 
const map = step.getMap();
console.log(map.map(6)) // 输出为 3, 表明之前的位置 6 处于现在的位置 3
console.log(map.map(2)) // 2
console.log(map.map(1)) // 1
console.log('------')

// ------
const tr2 = new Transform(state.doc);
// 0   1 2 3 4 5 6    7
//  <p> h e l l o </p>
tr2.split(3)
// 0   1 2 3    4   5 6 7 8    9
//  <p> h e </p> <p> l l o </p>

console.log(tr2.mapping.map(7)) // 9
console.log(tr2.mapping.map(3)) // 5
console.log(tr2.mapping.map(3, -1)) // 3
console.log('------')

// -------

const { tr: tr3 } = state;
tr3.insertText('world');
newState = state.apply(tr3)