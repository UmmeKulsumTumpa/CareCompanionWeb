// Typed versions of useDispatch and useSelector — use these throughout the app
// instead of the plain react-redux equivalents to get full TypeScript inference.
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
    useSelector(selector);
