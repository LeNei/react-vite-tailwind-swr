import { useTodos } from "./data/todos"

function App() {
  const { data, error } = useTodos();

  if (!data && !error) {
    return <h1 className="text-3xl">Loading...</h1>
  }

  if (!data) {
    return <h1 className="text-3xl text-red-500">Error</h1>
  }

  return (
    <div className="flex flex-wrap m-10">
      {data.map(({ id, title, completed }, index) => (
        <div key={index} className="p-5 mr-10 mb-5 rounded-lg shadow-lg flex flex-col space-y-1">
          <span className="text-lg font-bold">{id}</span>
          <span>{title}</span>
          <span>{completed}</span>
        </div>
      ))}
    </div>
  )
}

export default App
