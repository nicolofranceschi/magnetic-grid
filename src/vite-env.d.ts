/// <reference types="vite/client" />

interface AnyProps extends Record<string, any> {}
interface ChildrenProps {
  children?: React.ReactNode;
}
interface FunctionChildren<T> {
  children: (p: T) => React.ReactElement;
}
type ReactComponent = (p: AnyProps) => React.ReactElement;
type SetFunction<T> = React.Dispatch<React.SetStateAction<T>>;
type State<T> = [T, SetFunction<T>];
type EmptyFunction = () => void;