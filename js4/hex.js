///////////////////////////////////////////////////////////////////////////
// A React Like Functional HTML Library that supports stateless and stateful 
// components as well as component composition in less than 20 lines
//
let render = function (component, initState = {}, mountNode = 'app') {
    initState.render = function( stateRepresentation, options = {} ) {
      const start = (options.focus) ? document.getElementById(options.focus).selectionStart : 0;
      (document.getElementById(mountNode) || {}).innerHTML = stateRepresentation
      if (options.focus) {
        let f = document.getElementById(options.focus)
        f.selectionStart = start
        f.focus()
      }
    }
  
    let stateRepresentation = component(initState)
  
    initState.render((typeof stateRepresentation === 'function' ) ? stateRepresentation() : stateRepresentation)
  }
  
  let intent = function(i, f) {
    window[i || '_'] = f 
  }
  
  let value = function(el) {
    return document.getElementById(el).value
  }
  ///////////////////////////////////////////////////////////////////////////
  
  ///////////////////////////////////////////////////////////////////////////
  // Examples (from http://reactjs.org)
  //
  // HelloMessage: Stateless Component
  //
  let HelloMessage = ({name}) => `Hello ${name}`
  
  // Timer: Stateful Component (not recommended, use a single-state-tree if possible)
  let Timer = function({seconds, render}) {
    let state = {seconds, render}
  
    let tick = function () {
      state.seconds += 1
      state.render(representation())
    }
  
    let interval = setInterval(() => tick(), 1000)
  
    let representation = () => `Seconds: ${state.seconds}`
  
    return representation
  }
  
  // Todo: Stateful Component + Component Composition
  let TodoApp = function({render}) {
    let state = { items: [], text:'', render }
    
    intent( "addTodo", function(e) {
      const newItem = {
        text: value("text"),
        id: Date.now()
      }
      state.items.push(newItem)
      state.text = ''
      state.render(representation())
      return false
    })
  
    let representation = () => `
        <div>
          <h4>TODO</h4>
          ${TodoList({items:state.items})}
          <form onsubmit="addTodo()">
            <input id="text" value=${state.text}>
            <button>
            Add #${state.items.length + 1}
            </button>
          </form>
        </div>`
  
    return representation
  }
  // How easy is it to mount a handler on a child element?
  // as easy as passing a string! The corresponding intent
  // can be declared anywhere, yes you can try this at home!
  let TodoList = ({items, onclick}) => `
      <ul>
        ${items.map(item => `<li key="${item.id}" ${(onclick) ? `onclick="${onclick}(${item.id})"` : ``}>${item.text}</li>`)}
      </ul>`
  
  let MarkdownEditor = function({defaultValue, render}) {
    let state = { value: defaultValue || 'Type some *markdown* here!', render }
  
    let input = "mde"
    intent("handleChange", function () {
      state.value = value(input)
      state.render(representation(), {focus: input})
      return false
    })
  
    const md = new Remarkable();
  
    let representation = () => `
        <h3>Input</h3>
        <textarea id="${input}" oninput="handleChange()">${state.value}</textarea>
        <h3>Output</h3>
        <div>
        ${md.render(state.value)}
        </div>
        `
    return representation
  }

  // Display Components
  render(
    HelloMessage, 
    {name: "Jane"}, 
    "hello"
  )
  
  render(
    Timer, {seconds: 0},
    "timer"
  )
  
  render(
    TodoApp, {},
    "todo"
  )
  
  render(
    MarkdownEditor, {},
    "markdown"
  )