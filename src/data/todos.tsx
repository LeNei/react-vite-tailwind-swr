import useSWR from "swr"
import http from "./http"

interface ITodo {
  userId: number,
  id: number,
  title: string,
  completed: boolean
}

export function useTodos() {
  return useSWR<ITodo[]>("/todos", () => http.get<ITodo[]>("https://jsonplaceholder.typicode.com/todos"))
}
