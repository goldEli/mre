export declare global {
  const getAjax: GetAjax<T>
  const J_color: any
  interface Window {
    stateIndex: number
    requestIdleCallback: (a:any) => void
  }
}